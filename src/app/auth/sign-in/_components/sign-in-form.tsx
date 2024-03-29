"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";

import { Icons } from "@/components/icons";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SignInFormProps {
  callbackUrl: string;
}

export const SignInForm = ({ callbackUrl }: SignInFormProps) => {
  const { data: session } = useSession();
  const user = session?.user;

  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  if (user) {
    redirect("/");
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        callbackUrl: callbackUrl,
        email,
        password,
      });

      setIsLoading(false);

      if (res?.error) {
        toast({
          title: "Invalid email or password.",
          description:
            "The email or password provided is invalid of does not exist!",
          variant: "destructive",
        });
        revalidatePath("/");
        redirect("/");
      }

      revalidatePath(callbackUrl);
      redirect(callbackUrl);
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  const input_style =
    "block w-full h-10 rounded-md border-0 bg-background/50 py-1.5 shadow-sm ring-1 ring-inset ring-ring placeholder:text-muted focus:bg-background focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6";

  return (
    <MaxWidthWrapper className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="-m-2 rounded-xl bg-foreground/5 p-2 ring-1 ring-inset ring-ring/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="rounded-md bg-background/80 p-2 shadow-2xl ring-1 ring-ring/10 sm:p-8 md:p-20">
              <div className="mx-auto mb-10 flex flex-col items-center justify-center space-y-4">
                <Link href="/" className="z-40 flex items-center gap-2">
                  <Icons.logo className="h-8 w-8 fill-text" />
                  <h2 className="text-xl font-bold">
                    H<span className="text-primary">HN</span>
                  </h2>
                </Link>
                <h1 className="text-center text-3xl font-bold leading-9 tracking-tight md:text-4xl lg:text-5xl">
                  Sign In
                </h1>
              </div>

              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium leading-6">
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        required
                        type="email"
                        placeholder="Email..."
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${input_style}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium leading-6">
                      Password
                    </label>
                    <div className="relative mt-2">
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Password..."
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${input_style}`}
                      />
                      <button
                        onClick={togglePassword}
                        type="button"
                        className="absolute right-2 top-[25%]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full uppercase shadow-md"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          <p>Loading...</p>
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                </form>

                <p className="mt-10 text-center text-sm text-muted">
                  Don&apos;t have an account yet?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="font-semibold leading-6 text-primary underline-offset-2 hover:underline"
                  >
                    Sign Up!
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export const SignInSkeleton = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <div className="flex space-x-2">
        <div className="h-8 w-8 animate-bounce rounded-full bg-text [animation-delay:-0.3s]" />
        <div className="h-8 w-8 animate-bounce rounded-full bg-text [animation-delay:-0.15s]" />
        <div className="h-8 w-8 animate-bounce rounded-full bg-text" />
      </div>
      <p className="text-4xl">Loading... Please wait!</p>
    </div>
  );
};
