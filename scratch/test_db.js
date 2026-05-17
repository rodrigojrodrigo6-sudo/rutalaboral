const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wsakftvfjnyeovhnegmh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzYWtmdHZmam55ZW92aG5lZ21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTM2MjAsImV4cCI6MjA5NDQ2OTYyMH0.abrD4RDtFWu6RFUO30vt8sLqs4iVYLbzbMp_gyiWGsc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Querying profiles...');
  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('*');
  console.log('Profiles count:', profiles ? profiles.length : 0);
  console.log('Profiles:', profiles);

  console.log('Querying job_offers...');
  const { data: jobs, error: jError } = await supabase
    .from('job_offers')
    .select('*');
  console.log('Jobs count:', jobs ? jobs.length : 0);
}

test();
