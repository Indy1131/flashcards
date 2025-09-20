import { useState } from "react";

type CreateFolderProps = {
  handleCreate: (formData: { name: string }) => void;
};

export default function CreateFolder({ handleCreate }: CreateFolderProps) {
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  function handleCreateClick() {
    setCreating(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleCancelClick() {
    setCreating(false);
    setFormData({ name: "" });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setCreating(false);
    handleCreate(formData);
    setFormData({ name: "" });
  }

  if (!creating)
    return (
      <button
        onClick={handleCreateClick}
        className="cursor-pointer bg-blue-500 text-white py-2 w-[200px]"
      >
        New Folder
      </button>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-[164px_1fr] border-1 max-w-[600px]"
    >
      <div className="flex items-center gap-2 justify-center border-r-2">
        <button
          type="submit"
          className=" cursor-pointer flex items-center justify-center bg-blue-500 border-2 border-blue-500 text-white py-1 px-2 rounded-md text-sm"
        >
          Create
        </button>
        <button
          className="cursor-pointer flex items-center justify-center text-blue-500 border-2 py-1 px-2 rounded-md text-sm"
          onClick={handleCancelClick}
          type="button"
        >
          Cancel
        </button>
      </div>
      <div className="p-2">
        <input
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          name="name"
          className="border-2 rounded-md w-full px-2 auto"
          autoComplete="off"
        />
      </div>
    </form>
  );
}
