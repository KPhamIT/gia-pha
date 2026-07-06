import JoinTokenPageView from "@/components/public/join/JoinTokenPageView";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function JoinOrgPage({ params }: Props) {
  const { token } = await params;
  return <JoinTokenPageView token={token} />;
}
