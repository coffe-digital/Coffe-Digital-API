import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FileDTO } from 'src/product/dto/file.dto';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  constructor() {
    //const supabaseURL = process.env.SUPABASE_URL;
    //const supabaseKEY = process.env.SUPABASE_KEY;

    //this.supabase = createClient(supabaseURL, supabaseKEY);
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
