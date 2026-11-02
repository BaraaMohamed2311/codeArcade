import { getTopicList } from "../../../lib/problems";
import TopicClient from "./TopicClient";

export function generateStaticParams() {
  return getTopicList().map((t) => ({ topic: t.slug }));
}

export default function TopicPage({ params }: { params: { topic: string } }) {
  return <TopicClient topicSlug={params.topic} />;
}
