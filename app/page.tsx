import VoyageStory from "@/components/home/VoyageStory";
import ExploreGrid from "@/components/home/ExploreGrid";
import { getStoryData } from "@/components/home/storyData";

export default function HomePage() {
  const data = getStoryData();
  return (
    <>
      <VoyageStory data={data} />
      <ExploreGrid />
    </>
  );
}
