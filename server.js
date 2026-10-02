import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const MESHY_API_KEY = process.env.MESHY_API_KEY;

app.use(cors());
app.use(express.json({ limit: "80mb" }));
app.use(express.static("public"));

function headers() {
  return {
    "Authorization": `Bearer ${MESHY_API_KEY}`,
    "Content-Type": "application/json"
  };
}

app.post("/api/generate", async (req,res)=>{
  try {
    if (!MESHY_API_KEY) return res.status(500).json({error:"MESHY_API_KEY n'est pas configurée sur le serveur."});
    const { images, texturePrompt } = req.body;
    if (!Array.isArray(images) || images.length < 1 || images.length > 4)
      return res.status(400).json({error:"Envoie entre 1 et 4 images."});

    const body = {
      image_urls: images,
      ai_model: "meshy-7.1",
      geometry_resolution: "2k",
      should_texture: true,
      enable_pbr: true,
      texture_resolution: "4k",
      image_enhancement: true,
      remove_lighting: true,
      should_remesh: false,
      target_formats: ["glb"]
    };
    if (typeof texturePrompt === "string" && texturePrompt.trim())
      body.texture_prompt = texturePrompt.trim().slice(0,800);

    const r = await fetch("https://api.meshy.ai/openapi/v1/multi-image-to-3d", {
      method:"POST", headers:headers(), body:JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({error:data?.message || data?.task_error?.message || "Meshy a refusé la demande.", details:data});
    res.json({taskId:data.result});
  } catch(e) {
    res.status(500).json({error:e.message});
  }
});

app.get("/api/task/:id", async (req,res)=>{
  try {
    if (!MESHY_API_KEY) return res.status(500).json({error:"MESHY_API_KEY n'est pas configurée."});
    const r = await fetch(`https://api.meshy.ai/openapi/v1/multi-image-to-3d/${encodeURIComponent(req.params.id)}`, {
      headers:{"Authorization":`Bearer ${MESHY_API_KEY}`}
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({error:data?.message || data?.task_error?.message || "Erreur Meshy.", details:data});
    res.json(data);
  } catch(e) {
    res.status(500).json({error:e.message});
  }
});

app.get("*", (req,res)=>{
  if (req.path.startsWith("/api/")) return res.status(404).end();
  res.sendFile(process.cwd()+"/public/index.html");
});

app.listen(PORT,()=>console.log(`AI 3D Recreator server on port ${PORT}`));
