export async function sendWebhook(resumeId:string,status:string,url:string|null,distUrl:string) {
    const response=await fetch(distUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "webhook-secret": Deno.env.get("WEBHOOK_SECRET"),
        },
        body: JSON.stringify({resumeId,status,url}),
      });
      console.log("Response From Server :",response.status);
  }