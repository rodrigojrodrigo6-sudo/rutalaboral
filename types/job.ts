export type JobStatus = 'nuevo' | 'visitado' | 'cv_enviado' | 'no_aplica' | 'finalizado' | 'entrevista';

export interface JobOffer {
  id: string;
  user_id: string;
  titulo: string;
  empresa: string;
  descripcion_corta?: string;
  url: string;
  imagen_preview?: string;
  region?: string;
  fuente?: string;
  fecha_publicacion?: string;
  fecha_descubrimiento: string;
  estado: JobStatus;
  notas_personales?: string;
  created_at: string;
  updated_at: string;
}

export interface SearchPreferences {
  id: string;
  user_id: string;
  keywords: string[];
  regions: string[];
  sources: string[];
  is_active: boolean;
  last_scrape_at?: string;
}
