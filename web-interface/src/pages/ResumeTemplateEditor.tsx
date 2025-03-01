import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import ejs from "ejs";
import { useAuth } from "../context/AuthContext";

function ResumeTemplateEditor() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState("split"); // 'split', 'code', 'preview'
  const [template, setTemplate] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - <%= name %></title>
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 900px;
            margin: 30px auto;
            padding: 30px;
            background: white;
            border-radius: 10px;
        }
        h1, h2, h3 {
            color: #2c3e50;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #ddd;
        }
        .header h1 {
            margin: 5px 0;
            font-size: 32px;
        }
        .header p {
            color: #555;
            margin: 3px 0;
        }
        .section {
            margin-top: 15px;
            padding: 15px;
            border: 2px solid #3498db;
            border-radius: 5px;
            background: #ecf0f1;
        }
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .skill {
            background: #3498db;
            color: #fff;
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
        }
        .projects a {
            color: #2980b9;
            text-decoration: none;
        }
        .projects a:hover {
            text-decoration: underline;
        }
        .edu, .proj {
            padding: 10px;
            border-left: 3px solid #2ecc71;
            background: #ecf0f1;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        .proj p {
            margin: 5px 0;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h1><%=name %></h1>
            <p>📞 <%=phno %> |📌 <%=city %>| 📧 <%=email %></p>
            <p>🔗 <a href="<%= linkdin %>">LinkedIn</a> | <a href="<%=github %>">GitHub</a></p>
        </div>

        <div class="section">
            <h2>Summary</h2>
            <p><%=summary %></p>
        </div>

        <div class="section">
            <h2>Skills</h2>
            <div class="skills">
                <%skills.forEach(skill => { %>
                    <span class="skill"><%= skill %></span>
                <% }) %>
            </div>
        </div>

        <div class="section">
            <h2>Education</h2>
            <%education.forEach(edu => { %>
                <div class="edu">
                    <h3><%= edu.college_name %></h3>
                    <h4><%= edu.major %></h4>
                    <p><strong>Duration:</strong> <%= edu.starting %> - <%= edu.ending %></p>
                    <p><strong>GPA:</strong> <%= edu.gpa %></p>
                </div>
            <% }) %>
        </div>

        <div class="section projects">
            <h2>Projects</h2>
            <%projects.forEach(project => { %>
                <div class="proj">
                    <h3><%= project.title %></h3>
                    <p><strong>Tech Stack:</strong> <%= project.tech_stack %></p>
                    <ul>
                        <% project.description.split(".").forEach(desc => { if(desc.trim()) { %>
                            <li><%= desc.trim() %>.</li>
                        <% } }) %>
                    </ul>
                    <p>🔗 <a href="<%= project.link %>"><%= project.link %></a></p>
                </div>
            <% }) %>
        </div>
    </div>
</body>
</html>
`);

  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  const resumeData = {
    name: "Shatwik",
    phno: "3245425",
    city: "Kochi",
    email: "shatwik@gmail.com",
    linkdin: "https://linkedin.com/in/shatwik",
    github: "https://github.com/shatwik7",
    summary:
      "Software engineer with experience in backend development, distributed systems, and cloud computing. Passionate about building scalable applications and optimizing performance.",
    skills: ["Go", "C++", "Java", "Express", "Docker", "Kubernetes"],
    projects: [
      {
        title: "Chess App",
        link: "https://github.com/shatwik7/chess.com-clone",
        description:
          "Robust and interactive chess platform designed to deliver a seamless online chess experience.",
        tech_stack:
          "Node.js, Express, MongoDB, Redis, Nginx, React, Docker, Docker Compose",
      },
    ],
    education: [
      {
        college_name: "CUSAT",
        major: "Information Technology",
        starting: "12/1/12",
        ending: "12/3/16",
        gpa: 4.4,
      },
    ],
  };

  useEffect(() => {
    try {
      setPreview(ejs.render(template, resumeData));
      setError("");
    } catch (err) {
      if(err instanceof Error){
        setError(`Error rendering template: ${err.message}`);
      }
      else{
        setError(`Error rendering template: unknown error!!`);
      }
    }
  }, [template, user]);

  return (
    <div className="flex flex-col p-4 h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Resume Editor</h1>

      {/* View Mode Toggle Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          className={`py-2 px-4 rounded ${
            viewMode === "code"
              ? "bg-blue-700"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
          onClick={() => setViewMode("code")}
        >
          Code
        </button>
        <button
          className={`py-2 px-4 rounded ${
            viewMode === "split"
              ? "bg-blue-700"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
          onClick={() => setViewMode("split")}
        >
          Split View
        </button>
        <button
          className={`py-2 px-4 rounded ${
            viewMode === "preview"
              ? "bg-blue-700"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
          onClick={() => setViewMode("preview")}
        >
          Preview
        </button>
      </div>

      {/* Editor and Preview Container */}
      {viewMode === "split" && (
        <div
          className={`flex-grow flex ${
            viewMode === "split" ? "flex-row" : "flex-col"
          }`}
        >
          {/* Code Editor */}
          <div
            className={`w-full ${
              viewMode === "split" ? "md:w-1/2" : "w-full"
            } p-2`}
          >
            <Editor
              height="100%"
              defaultLanguage="html"
              value={template}
              onChange={setTemplate}
              theme="vs-dark"
              className="rounded-lg border border-gray-700"
            />
          </div>
          <div
            className={`w-full ${
              viewMode === "split" ? "md:w-1/2" : "w-full"
            } p-2`}
          >
            <iframe
              title="Resume Preview"
              srcDoc={preview}
              className="w-full h-full border border-gray-700 rounded-lg bg-white"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}

      {viewMode == "preview" && (
        <iframe
          title="Resume Preview"
          srcDoc={preview}
          className="w-full h-full border border-gray-700 rounded-lg bg-white"
          sandbox="allow-same-origin"
        />
      )}

      { viewMode =="code" && (
         <Editor
         height="100%"
         defaultLanguage="html"
         value={template}
         onChange={setTemplate}
         theme="vs-dark"
         className="rounded-lg border border-gray-700"
       />
      )}


      {/* Error Message */}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
}

export default ResumeTemplateEditor;
