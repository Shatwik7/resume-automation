export function convertS3Link(originalLink: string): string {
    // Split the link into parts
    const parts = originalLink.split('/');

    // Extract the bucket name and the rest of the path
    const bucketName = Deno.env.get("AWS_S3_BUCKET")||"";
    const region=Deno.env.get("AWS_REGION");
    const path = parts.slice(3).join('/');    // Joins the remaining parts

    // Construct the new link
    const newLink = `https://s3.${region}.amazonaws.com/${bucketName}/${path}`;
    return newLink;
}
