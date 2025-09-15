import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Mail, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <AuthLayout backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-card-foreground mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Join the artistic community
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div className="relative">
            <Label htmlFor="username" className="text-card-foreground">User Name</Label>
            <div className="relative mt-1">
              <Input 
                id="username"
                placeholder="Enter your username"
                className="pl-10 bg-muted/50 border-border/30"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="relative">
            <Label htmlFor="mobile" className="text-card-foreground">Mobile Number</Label>
            <div className="relative mt-1">
              <Input 
                id="mobile"
                placeholder="Enter your mobile number"
                className="pl-10 bg-muted/50 border-border/30"
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="relative">
            <Label htmlFor="email" className="text-card-foreground">Email</Label>
            <div className="relative mt-1">
              <Input 
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10 bg-muted/50 border-border/30"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="relative">
            <Label htmlFor="password" className="text-card-foreground">Password</Label>
            <div className="relative mt-1">
              <Input 
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10 bg-muted/50 border-border/30"
              />
              <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            Sign up
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <Separator className="bg-border/30" />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-muted-foreground text-sm">
            OR
          </span>
        </div>

        {/* Social Login */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="icon" className="bg-blue-600 hover:bg-blue-700 border-blue-600">
            <span className="text-white font-bold">f</span>
          </Button>
          <Button variant="outline" size="icon" className="bg-red-600 hover:bg-red-700 border-red-600">
            <span className="text-white font-bold">G+</span>
          </Button>
          <Button variant="outline" size="icon" className="bg-blue-400 hover:bg-blue-500 border-blue-400">
            <span className="text-white font-bold">t</span>
          </Button>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <span className="text-muted-foreground">Already have account? </span>
          <Link 
            to="/signin" 
            className="text-warm-gold hover:text-accent-foreground font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}