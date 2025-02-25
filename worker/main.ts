import { connect } from "https://deno.land/x/redis@v0.29.4/mod.ts";
import DetailExtractor from "./extractor.ts";
import type { Project } from "./project.ts";
import { generateUserResume } from "./pdf.ts";
import { convertS3Link } from "./util/linkConvetion.ts";
import { sendWebhook } from "./util/sendWebhook.ts";

function getGitHubOwner(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname.split("/")[1] || null;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}
async function processJob(task: any) {
  const extractor = DetailExtractor.getInstance();
  console.log(task.user.github, task.resume.selected_repo[0]);
  const owner = getGitHubOwner(task.user.github) || "";
  const projects: Project[] = await Promise.all(
    task.resume.selected_repo.map(async (repo: string) => {
      try {
        return await extractor.getProjectDetails(owner, repo);
      } catch (error) {
        console.error(`Error fetching details for repo ${repo}:`, error);
        return null;
      }
    })
  );
  const summaryAndSkills= await extractor.getSummaryAndSkills(JSON.stringify(projects));
  const resumeData={
    ...task.user,
    projects: projects.filter(Boolean),
    summary:summaryAndSkills.summary,
    skills:summaryAndSkills.skills,
  }
  console.log(resumeData);
  const pdfUrl = await generateUserResume(task.template.url, resumeData);
  const resumeUrl=convertS3Link(pdfUrl);
  console.log(resumeUrl);
  sendWebhook(task.resume._id,"completed",resumeUrl,task.distUrl);
}
async function startWorker(queueName: string) {
  const redis = await connect({ hostname: "localhost", port: 6379 });

  while (true) {
    const taskStr = await redis.blpop(0, queueName);
    console.log(taskStr);
    if (taskStr) {
      const task = JSON.parse(taskStr[1]);
      try{
        await processJob(task);
      }
      catch(e){
        console.log(e);
        sendWebhook(task.resume._id,"failed"," ",task.distUrl);
      }
    }
  }
}

startWorker("worker-queue");
