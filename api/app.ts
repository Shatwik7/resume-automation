import express, { Request, Response, NextFunction } from "npm:express";
import templateRoutes from "./routes/template.routes.ts";
import userRoutes from "./routes/user.routes.ts";
import resumeRoutes from "./routes/resume.routes.ts";
import paymentRoutes from "./routes/payment.routes.ts";
import { zodErrorHandler } from "./helper/zod.ts";
import cookieParser from "npm:cookie-parser";
import webhookRoutes from "./routes/webooks.routes.ts";
import cors from 'npm:cors';

const app = express();

app.use((req:Request,_res:Response,next:NextFunction)=>{
  console.log(new Date().toISOString()," ",req.method," ",req.url);
  next();
});
app.use(cors({
  origin: Deno.env.get("FRONTEND_URL"), // Allow frontend origin
  credentials: true, // Allow cookies/auth headers
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow custom headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Allowed methods
}));
app.use(express.json());
app.use(cookieParser(Deno.env.get("SECRET_TOKEN")));



app.use("/api/templates", templateRoutes);
app.use("/api/",userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/payments", paymentRoutes);


app.use("/api/webhooks",webhookRoutes);

app.use(zodErrorHandler);
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ message: err.message });
});

export default app;
