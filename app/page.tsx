import VoyageStory from "@/components/home/VoyageStory";
import ExploreGrid from "@/components/home/ExploreGrid";
import VoyageInNumbers from "@/components/viz/VoyageInNumbers";
import { getStoryData } from "@/components/home/storyData";

export default function HomePage() {
  const data = getStoryData();
  return (
    <>
      <VoyageStory data={data} />
      <VoyageInNumbers />
      <ExploreGrid />
    </>
  );
}
