// Importa a função de criação do client Supabase via CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Cria o client com a URL e a chave fornecidas
export const supabase = createClient(
  'https://gvdhslyfqnojpxcspayo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2ZGhzbHlmcW5vanB4Y3NwYXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTE2NTMsImV4cCI6MjA4NzY4NzY1M30.DHrHTxCyncjlXy9Al7uK09UDZcU-f_HJfy0VVD8DxCQ'
)
    