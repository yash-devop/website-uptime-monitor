import EditMonitorForm from "@/app/components/forms/EditMonitorForm";

export default function EditPage() {
  return (
    <>
    <div className="flex flex-col max-w-6xl mx-auto">
      <p className="text-2xl pb-4">Edit monitor</p>
      <EditMonitorForm />
    </div>
    </>
  );
}
