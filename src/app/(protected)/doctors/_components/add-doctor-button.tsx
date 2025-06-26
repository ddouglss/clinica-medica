'use-client'

import {Plus} from "lucide-react";

import UpsertDoctorForm from "@/app/(protected)/doctors/_components/upsert-doctor-form";
import {Button} from "@/components/ui/button";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";

const AddDoctorButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus/>
                    Adicionar médicos
                </Button>
            </DialogTrigger>
            <UpsertDoctorForm />
        </Dialog>
    );
}

export default AddDoctorButton;