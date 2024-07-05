import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FileDTO } from 'src/product/dto/file.dto';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  constructor() {
    const supabaseURL = 'https://jemztihjpmfdpjvzzicw.supabase.co';
    // const supabaseKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbXp0aWhqcG1mZHBqdnp6aWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzNTA0MzgsImV4cCI6MjAzNDkyNjQzOH0.sVBVZG22ajkyXUFbITWFa5hN9QpQRZeFtWIH_1Ewp30';
    const supabaseKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbXp0aWhqcG1mZHBqdnp6aWN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTM1MDQzOCwiZXhwIjoyMDM0OTI2NDM4fQ.qRrzqCoL4DHGauUl19Dz3k6rEukEl-1iXpzF80vbTw4'
    this.supabase = createClient(supabaseURL, supabaseKEY);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async uploadImage(file: FileDTO): Promise<string> {

    if (!this.allowedImageTypes.includes(file.mimetype)) {
        throw new Error('Only JPEG, PNG, and GIF images are allowed');
      }

    const { data, error } = await this.supabase.storage
      .from('coffe')
      .upload(file.originalname, file.buffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.mimetype
      });

    if (error) {
      console.log(error)
      throw new Error('Failed to upload image');
    }

    return data.path;
  }

  async getPublicUrl(path: string): Promise<string | null> {
    const  {data} = await this.supabase.storage
    .from('coffe')
    .getPublicUrl(path);

    console.log(path)

    return data.publicUrl || null;
  }

  async deleteImage(imagePath: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from('coffe')
      .remove([imagePath]);

    if (error) {
      throw new Error('Failed to delete image');
    }
  }
}
