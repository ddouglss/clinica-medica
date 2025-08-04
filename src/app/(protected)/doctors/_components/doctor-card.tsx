"use client";

import { AvatarFallback } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, } from "@/components/ui/card";

import { CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { doctorsTable } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { getAvailability } from "../_helpers/availability";
import { Button } from "@/components/ui/button";
import UpsertDoctorForm from "./upsert-doctor-form";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrencyInCents } from "@/helpers/currency";

interface DoctorCardProps {
    doctor: typeof doctorsTable.$inferSelect;
}

export const DoctorCard = ({doctor}: DoctorCardProps) => {
    const doctorInitials = doctor.name
    .split(" ")
    .map((name) => name[0]).join("");
    const availability = getAvailability(doctor);
    return (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{doctorInitials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col gap-2">
            <Badge variant="outline">
              <CalendarIcon className="mr-1" />
              {availability.from.format("dddd")} a {availability.to.format("dddd")}
            </Badge>
            <Badge variant="outline">
              <ClockIcon className="me-1" />
              {availability.from.format("HH:mm")} as{" "} {availability.to.format("HH:mm")}
            </Badge>
            <Badge variant="outline">
              {formatCurrencyInCents(doctor.appointmentPriceInCents)}
            </Badge>
          </CardContent>
          <Separator />
          <CardFooter className="flex flex-col gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Ver detalhes</Button>
              </DialogTrigger>
                <UpsertDoctorForm />
            </Dialog>
          </CardFooter>
        </Card>
      );
    };
