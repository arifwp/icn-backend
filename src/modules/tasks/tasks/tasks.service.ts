import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Database } from 'database/supabase';
import { SupabaseClientService } from 'src/supabase/supabase.client/supabase.client.service';
import { CreateTaskDto, FilterTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { TaskStatus } from '../entities/task.entity/task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly supabaseClientService: SupabaseClientService) {}

  async create(
    taskDto: CreateTaskDto,
    userId: string,
  ): Promise<Database['public']['Tables']['tasks']['Row']> {
    try {
      const { data, error } = await this.supabaseClientService.client
        .from('tasks')
        .insert({
          title: taskDto.title,
          description: taskDto.description,
          status: taskDto.status || TaskStatus.TODO,
          startDate: taskDto.startDate,
          endDate: taskDto.endDate,
          userId,
        })
        .select()
        .single();

      if (error) {
        throw new InternalServerErrorException(error.message);
      }

      return data;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException('Gagal membuat task');
    }
  }

  async findAllByUserId(
    userId: string,
    filter?: FilterTaskDto,
  ): Promise<Database['public']['Tables']['tasks']['Row'][]> {
    try {
      let query = this.supabaseClientService.client
        .from('tasks')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });

      if (filter?.status) {
        query = query.eq('status', filter.status);
      }

      const { data, error } = await query;

      if (error) {
        throw new InternalServerErrorException(error.message);
      }

      return data;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException('Gagal menampilkan semua task');
    }
  }

  async findOne(
    id: string,
    userId: string,
  ): Promise<Database['public']['Tables']['tasks']['Row']> {
    try {
      const { data, error } = await this.supabaseClientService.client
        .from('tasks')
        .select('*')
        .eq('id', id)
        .eq('userId', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException(
          error.message || 'Gagal menemukan task yang dicari',
        );
      }

      return data;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException('Gagal menemukan task');
    }
  }

  async update(
    id: string,
    taskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Database['public']['Tables']['tasks']['Update']> {
    try {
      await this.findOne(id, userId);

      const updateData: Partial<
        Database['public']['Tables']['tasks']['Update']
      > = {
        updatedAt: new Date().toISOString(),
      };

      if (taskDto.title) updateData.title = taskDto.title;
      if (taskDto.description) updateData.description = taskDto.description;
      if (taskDto.status) updateData.status = taskDto.status;
      if (taskDto.startDate) updateData.startDate = taskDto.startDate;
      if (taskDto.endDate) updateData.endDate = taskDto.endDate;

      const { data, error } = await this.supabaseClientService.client
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .eq('userId', userId)
        .select()
        .single();

      if (error) {
        throw new InternalServerErrorException(error.message);
      }

      return data;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException('Gagal update task');
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      await this.findOne(id, userId);

      const { error } = await this.supabaseClientService.client
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('userId', userId);

      if (error) {
        throw new InternalServerErrorException(error.message);
      }
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException('Gagal hapus task');
    }
  }
}
