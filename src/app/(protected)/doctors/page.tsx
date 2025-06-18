import {Plus} from "lucide-react";
import {redirect} from "next/navigation";

import {Button} from "@/components/ui/button";
import {
  PageActions,
  PageContainer, PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle
} from "@/components/ui/page-container";
import {auth} from "@/lib/auth";

const DoctorsPage = async () => {
  const session = await auth.api.getSession();
  if (!session?.user){
    redirect("/authentication");
  }
  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  return <PageContainer>
    <PageHeader>
      <PageHeaderContent>
        <PageTitle>Médicos</PageTitle>
        <PageDescription>
            Gerencie os médicos da sua clínica
        </PageDescription>
      </PageHeaderContent>
      <PageActions>
        <Button>
          <Plus/>
          Adicionar médicos
        </Button>
      </PageActions>
    </PageHeader>
    <PageContent>
      <h1>Médicos</h1>
    </PageContent>
  </PageContainer>
};

export default DoctorsPage;