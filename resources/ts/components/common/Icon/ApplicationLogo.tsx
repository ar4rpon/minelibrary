import { SquareLibrary } from 'lucide-react';

export default function ApplicationLogo() {
  return (
    <div className="flex items-center font-bold">
      <SquareLibrary size={24} color="green" />
      <p className="pl-1 text-lg text-green-800">Mine Libraly</p>
    </div>
  );
}
