import { Github } from 'lucide-react';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';

export function App() {

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex items-center justify-between py-3 px-6 border-b'>
        <h1 className='text-xl font-bold'>upload.ai</h1>
        <div className='flex items-center gap-3'>
          <span className='text-sm text-muted-foreground'>Desenvolvido com love no NLW</span>
          <Separator orientation='vertical' className='h-6' />
          <Button variant='outline'>
            <Github className='w-4 h-4 mr-2' />
            Github
          </Button>
        </div>
      </div>
      <div className='flex-1 p-6'>oi</div>
    </div>
  );
}