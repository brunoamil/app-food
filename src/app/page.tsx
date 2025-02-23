import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HomePage = () => {
  return (
    <div className="p-5 border border-red-300 rounded-xl">
      <h2 className="text-red-500">Hello</h2>
      <Button>Button</Button>
      <Input placeholder="Place holder"/>
    </div>
  );
};

export default HomePage;
