import "https://deno.land/std@0.220.0/dotenv/load.ts";

const GITHUB_API_URL = "https://api.github.com/repos";
const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN") || "";
const GEMINI_TOKEN = Deno.env.get("GEMINI_TOKEN") || "";

// Package files for different languages
const packageFiles: Record<string, string[]> = {
  Python: ["requirements.txt", "Pipfile", "pyproject.toml"],
  JavaScript: ["package.json", "yarn.lock"],
  Go: ["go.mod", "go.sum"],
  Ruby: ["Gemfile", "Gemfile.lock"],
  Java: ["pom.xml", "build.gradle"],
  Deno: ["deno.json", "deno.lock"],
  Bun: ["bun.lockb"],
  Rust: ["Cargo.toml", "Cargo.lock"],
  NodeJS: ["package-lock.json"],
  CSharp: [".csproj", ".sln"],
  Cpp: ["CMakeLists.txt", "Makefile", "conanfile.txt"],
  PHP: ["composer.json", "composer.lock"],
  Swift: ["Package.swift"],
  Kotlin: ["build.gradle.kts"],
  Dart: ["pubspec.yaml", "pubspec.lock"],
  Elixir: ["mix.exs", "mix.lock"],
  Haskell: ["stack.yaml", "cabal.project"],
  Perl: ["cpanfile", "Makefile.PL"]
};

class DetailExtractor {
  private static instance:DetailExtractor;
  private gitHubToken: string;
  private geminiToken: string;

  private constructor() {
    this.gitHubToken = GITHUB_TOKEN;
    this.geminiToken = GEMINI_TOKEN;
  }
  public static getInstance():DetailExtractor{
    if(!DetailExtractor.instance){
      DetailExtractor.instance=new DetailExtractor();
    }
    return DetailExtractor.instance
  }
  async getProjectDetails(owner: string, repo: string) {
    try {
      console.log("🔄 Fetching repo details...");
      const repoContents = await this.traverseRepo(owner, repo, "");
      console.log("✅ Repo details fetched!");

      console.log("🤖 Sending to Gemini AI...");
      const project = await this.parseWithGemini(repoContents);
      console.log("project :: ",project);
      project.link = `https://github.com/${owner}/${repo}`;

      console.log("✅ AI Extracted Project Details:");
      console.log(JSON.stringify(project, null, 2));

      return project;
    } catch (error) {
        if(error instanceof(Error)){
            console.error("❌ Error fetching project details:", error.message);
            return null;
        }
    }
  }

  async traverseRepo(owner: string, repo: string, path: string): Promise<string> {
    try {
      const contents = await this.fetchRepoContents(owner, repo, path);
      let repoContents = "";

      for (const content of contents) {
        if (content.type === "file") {
          if (content.name.toLowerCase() === "readme.md") {
            console.log(`Found README: ${content.path}`);
            repoContents += "\n" + (await this.downloadFile(content.download_url));
          }

          for (const lang in packageFiles) {
            if (packageFiles[lang].includes(content.name)) {
              console.log(`Found ${lang} package file: ${content.path}`);
              repoContents += "\n" + (await this.downloadFile(content.download_url));
            }
          }
        } else if (content.type === "dir") {
          repoContents += "\n" + (await this.traverseRepo(owner, repo, content.path));
        }
      }

      return repoContents;
    } catch (error) {
      console.error("Error traversing repo:", (error as Error).message);
      return "";
    }
  }

  async fetchRepoContents(owner: string, repo: string, path: string) {
    try {
      const url = `${GITHUB_API_URL}/${owner}/${repo}/contents/${path}`;
      const response = await fetch(url, {
        headers: { Authorization: `token ${this.gitHubToken}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch repo contents: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching repo contents: ${(error as Error).message}`);
    }
  }

  async downloadFile(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `token ${this.gitHubToken}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error("Error downloading file:", (error as Error).message);
      return "";
    }
  }

  async parseWithGemini(data: string) {
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.geminiToken}`;
    data=data.slice(0,12000);
    const prompt = `
    ${data}

    ### From that data
    Extract a new resume project details from this text and return JSON only !!! in this formate:
    give one single
    {
      "title": "string",
      "description": "string",  // use simple words and strings should be between 30 to 40 words
      "tech_stack": "comma separated strings" 
    }
    `;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`Failed to fetch AI response: ${response.status}`);
      }

      const jsonResponse = await response.json();
      if (!jsonResponse.candidates || !jsonResponse.candidates.length) {
        throw new Error("Invalid response from Gemini API");
      }
      console.log(jsonResponse);
      const cleanedText = jsonResponse.candidates[0].content.parts[0].text;
      return JSON.parse(cleanedText.replace(/```json|```/g, "").trim());
    } catch (error) {
      console.error("Error parsing AI response:", (error as Error).message);
      return null;
    }
  }

  async getSummaryAndSkills(data: string) {
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.geminiToken}`;

    const prompt = `this is the data
    ${data}
    
    Extract a summary and skills from this text for the software fresher resume profile. Return only JSON:
    use this formate:
    {
      "summary": "string",
      "skills": "string[]"
    }`;
  
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch AI response: ${response.status}`);
      }
  
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      if (!jsonResponse.candidates || !jsonResponse.candidates.length) {
        throw new Error("Invalid response from Gemini API");
      }
  
      const cleanedText = jsonResponse.candidates[0].content.parts[0].text;
      return JSON.parse(cleanedText.replace(/```json|```/g, "").trim());
    } catch (error) {
      console.error("Error parsing AI response:", (error as Error).message);
      return null;
    }
  }
  
  
}

export default  DetailExtractor;
