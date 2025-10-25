export function ProfileStats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-6 border rounded-xl shadow-island bg-card">
        <div className="text-3xl font-bold">47</div>
        <p className="text-sm text-muted-foreground mt-1">Contracts Managed</p>
      </div>
      <div className="p-6 border rounded-xl shadow-island bg-card">
        <div className="text-3xl font-bold">8</div>
        <p className="text-sm text-muted-foreground mt-1">Active Policies</p>
      </div>
      <div className="p-6 border rounded-xl shadow-island bg-card">
        <div className="text-3xl font-bold">12</div>
        <p className="text-sm text-muted-foreground mt-1">Pending Approvals</p>
      </div>
    </div>
  );
}
