import { redirect } from "next/navigation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  redirect(`${process.env.NEXT_PUBLIC_API_URL}/s/${slug}`);
}
