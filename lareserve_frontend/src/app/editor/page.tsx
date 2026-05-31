import { AuthGuard } from '@/features/auth/ui/AuthGuard';
import FloorPlanEditor from '@/features/floorPlan/ui/FloorPlanEditor';

export default function EditorPage() {
  return (
    <AuthGuard>
      <FloorPlanEditor />
    </AuthGuard>
  );
}
