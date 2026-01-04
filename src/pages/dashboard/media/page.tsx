import { MediaLibrary } from "@/widgets/media/library";

export const DashboardMediaPage = () => {
  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold">Media</h1>
        <p className="text-sm text-zinc-500">
          Upload, browse, and manage your media assets.
        </p>
      </header>
      <MediaLibrary />
    </div>
  );
};
