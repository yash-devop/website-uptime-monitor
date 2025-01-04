
import CreateMonitorForm from "@/app/components/forms/CreateMonitorForm";

export default function CreatePage() {
  return (
    <>
    <div className="flex flex-col max-w-6xl mx-auto">
      <p className="text-2xl pb-4">Create monitor</p>
      <CreateMonitorForm />
    </div>
    </>
  );
}
