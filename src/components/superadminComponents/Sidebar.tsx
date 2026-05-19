"use client";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Banknote,
  BookOpen,
  CalendarClock,
  GraduationCap,
  Home,
  MessagesSquare,
  TableOfContents,
  UserPen,
} from "lucide-react";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  const handleLogout = () => {
    Cookies.remove("token"), Cookies.remove("role");
    router.push("/");
  };

  // Function to check if a link is active
  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Sidebar (Collapsible) */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild className="cursor-pointer">
            <TableOfContents className="mt-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[80vw]">
            <SheetHeader className="flex gap-4 flex-row">
              <Image
                src="/me.png"
                alt={"me"}
                width={70}
                height={70}
                className="object-contain rounded-full"
              />
              <div>
                <SheetTitle>Prashant Thapa</SheetTitle>
                <SheetDescription>Principle</SheetDescription>
              </div>
            </SheetHeader>
            <div className="mt-10 *:mb-3 *:text-xl font-semibold *:flex *:gap-3 cursor-pointer">
              <SheetClose asChild>
                <Link
                  href="/superadmin"
                  className={`flex gap-3 items-center ${
                    isActive("/superadmin") ? "text-blue-500" : ""
                  }`}
                >
                  <Home /> DashBoard
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/superadmin/teacher"
                  className={`flex gap-3 items-center ${
                    isActive("/superadmin/teacher") ? "text-blue-500" : ""
                  }`}
                >
                  <BookOpen /> Teachers
                </Link>
              </SheetClose>

              <Collapsible className="flex-col gap-0 justify-start">
                <CollapsibleTrigger className="text-start flex gap-3">
                  <UserPen /> Students
                </CollapsibleTrigger>
                <CollapsibleContent className="text-base font-medium pl-14">
                  <SheetClose asChild>
                    <Link
                      href="/superadmin/student"
                      className={`${
                        isActive("/superadmin/student") ? "text-blue-500" : ""
                      }`}
                    >
                      Student
                    </Link>
                  </SheetClose>
                </CollapsibleContent>
                <CollapsibleContent className="text-base font-medium pl-14">
                  <SheetClose asChild>
                    <Link
                      href="/superadmin/student/classes"
                      className={`${
                        isActive("/superadmin/student/classes")
                          ? "text-blue-500"
                          : ""
                      }`}
                    >
                      Classes
                    </Link>
                  </SheetClose>
                </CollapsibleContent>
              </Collapsible>

              <SheetClose asChild>
                <Link
                  href="/superadmin/course"
                  className={`flex gap-3 items-center ${
                    isActive("/superadmin/course") ? "text-blue-500" : ""
                  }`}
                >
                  <GraduationCap /> Courses
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/superadmin/fees"
                  className={`flex gap-3 items-center ${
                    isActive("/superadmin/fees") ? "text-blue-500" : ""
                  }`}
                >
                  <Banknote /> Fees
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/superadmin/event"
                  className={`flex gap-3 items-center ${
                    isActive("/superadmin/event") ? "text-blue-500" : ""
                  }`}
                >
                  <CalendarClock /> Events
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/superadmin/notice"
                  className={`flex gap-3 items-center ${
                    isActive("/superadmin/notice") ? "text-blue-500" : ""
                  }`}
                >
                  <MessagesSquare /> Notice
                </Link>
              </SheetClose>

              <p onClick={() => handleLogout()}>LogOut</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar (Static) */}
      <div className="hidden md:block w-[25%] min-w-[250px] h-screen bg-white shadow-lg fixed left-0 top-0 p-6">
        <div className="flex gap-4 flex-row items-center">
          <Image
            src="/me.png"
            alt={"me"}
            width={70}
            height={70}
            className="object-contain rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">Prashant Thapa</h1>
            <p className="text-sm text-gray-600">Principle</p>
          </div>
        </div>
        <div className="mt-10 *:mb-3 *:text-xl font-semibold *:flex *:gap-3 cursor-pointer">
          <Link
            href="/superadmin"
            className={`flex gap-3 items-center ${
              isActive("/superadmin") ? "text-blue-500" : ""
            }`}
          >
            <Home /> DashBoard
          </Link>

          <Link
            href="/superadmin/teacher"
            className={`flex gap-3 items-center ${
              isActive("/superadmin/teacher") ? "text-blue-500" : ""
            }`}
          >
            <BookOpen /> Teachers
          </Link>

          <div className="flex-col gap-0 justify-start">
            <div className="text-start flex gap-3">
              <UserPen /> Students
            </div>
            <div className="text-base font-medium pl-14">
              <Link
                href="/superadmin/student"
                className={`${
                  isActive("/superadmin/student") ? "text-blue-500" : ""
                }`}
              >
                Student
              </Link>
            </div>
            <div className="text-base font-medium pl-14">
              <Link
                href="/superadmin/student/classes"
                className={`${
                  isActive("/superadmin/student/classes") ? "text-blue-500" : ""
                }`}
              >
                Classes
              </Link>
            </div>
          </div>

          <Link
            href="/superadmin/course"
            className={`flex gap-3 items-center ${
              isActive("/superadmin/course") ? "text-blue-500" : ""
            }`}
          >
            <GraduationCap /> Courses
          </Link>

          <Link
            href="/superadmin/fees"
            className={`flex gap-3 items-center ${
              isActive("/superadmin/fees") ? "text-blue-500" : ""
            }`}
          >
            <Banknote /> Fees
          </Link>

          <Link
            href="/superadmin/event"
            className={`flex gap-3 items-center ${
              isActive("/superadmin/event") ? "text-blue-500" : ""
            }`}
          >
            <CalendarClock /> Events
          </Link>

          <Link
            href="/superadmin/notice"
            className={`flex gap-3 items-center ${
              isActive("/superadmin/notice") ? "text-blue-500" : ""
            }`}
          >
            <MessagesSquare /> Notice
          </Link>

          <p onClick={() => handleLogout()}>LogOut</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
