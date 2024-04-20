import { Editor } from "@/components/editor";
import { getCurrentUser } from "@/lib/session";
import { notFound, redirect } from "next/navigation";

interface EditorPageProps {
  params: { postId: string };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // const post = await getPostForUser(params.postId, user.id)
  const post: {
    id: string;
    title: string;
    content: string;
    published: boolean;
  } = {
    id: "1",
    title: "Post",
    content: "This is a post.",
    published: true,
  };

  if (!post) {
    notFound();
  }

  return (
    <Editor
      post={{
        id: post.id,
        title: post.title,
        content: post.content,
        published: post.published,
      }}
    />
  );
}
