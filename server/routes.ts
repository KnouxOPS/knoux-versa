import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { storage } from "./storage";
import { insertTransformationSchema, insertVipSessionSchema } from "@shared/schema";
import { processImageTransformation } from "./ai/imageProcessor";

// Configure multer for image uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Image upload endpoint
  app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      // Move file to permanent location
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const permanentPath = path.join('uploads', fileName);
      await fs.rename(req.file.path, permanentPath);

      res.json({ 
        imageUrl: `/uploads/${fileName}`,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  // AI transformation endpoint
  app.post('/api/transform', async (req, res) => {
    try {
      const transformationData = insertTransformationSchema.parse(req.body);
      
      // Validate required fields
      if (!transformationData.originalImageUrl || !transformationData.prompt || !transformationData.service) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check VIP access for VIP services
      if (transformationData.isVIP) {
        const vipKey = req.headers['x-vip-key'] as string | undefined;
        if (!vipKey) {
          return res.status(401).json({ error: 'VIP key required for this service' });
        }

        const vipSession = await storage.getVipSession(vipKey);
        if (!vipSession || !vipSession.isActive) {
          return res.status(403).json({ error: 'Invalid or expired VIP key' });
        }
      }

      // Process the image transformation
      const transformedImageUrl = await processImageTransformation({
        originalImageUrl: transformationData.originalImageUrl,
        prompt: transformationData.prompt,
        service: transformationData.service,
        selectionData: transformationData.selectionData || undefined,
        quality: transformationData.quality || "standard",
        isVIP: transformationData.isVIP || false
      });

      // Save transformation to storage
      const transformation = await storage.createTransformation({
        ...transformationData,
        transformedImageUrl
      });

      res.json(transformation);
    } catch (error) {
      console.error('Transformation error:', error);
      res.status(500).json({ error: 'Failed to process transformation' });
    }
  });

  // VIP authentication endpoint
  app.post('/api/vip/authenticate', async (req, res) => {
    try {
      const { vipKey } = req.body;
      
      // Read the VIP key from the secure file
      const correctVipKey = process.env.VIP_KEY || 'SADEK_ELGAZAR_VIP_2025';
      
      if (vipKey !== correctVipKey) {
        return res.status(401).json({ error: 'Invalid VIP key' });
      }

      // Create VIP session
      const sessionKey = `vip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const vipSession = await storage.createVipSession({
        sessionKey,
        isActive: true,
        expiresAt
      });

      res.json({ 
        success: true, 
        sessionKey: vipSession.sessionKey,
        message: 'VIP access granted. Welcome, Sadek Elgazar!'
      });
    } catch (error) {
      console.error('VIP auth error:', error);
      res.status(500).json({ error: 'VIP authentication failed' });
    }
  });

  // Get transformation history
  app.get('/api/transformations', async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const transformations = await storage.getUserTransformations(userId);
      res.json(transformations);
    } catch (error) {
      console.error('Get transformations error:', error);
      res.status(500).json({ error: 'Failed to fetch transformations' });
    }
  });

  // Serve uploaded images
  app.use('/uploads', express.static('uploads'));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      service: 'KNOUX VERSA',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
