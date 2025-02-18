import { Card, CardFooter, CardHeader } from "../ui/card";
import BackButton from "./backButton";
import Header from "./header";

export default function ErrorCard() {
  return (
    <Card className="w-[400px] shadow-none">
      <CardHeader>
        <Header
          label="Oops! Something went wrong"
          titleHeader="Authentication Error"
        />
      </CardHeader>
      <CardFooter className="flex items-center">
        <BackButton href="/auth/login" label="Back to login" />
      </CardFooter>
    </Card>
  );
}
