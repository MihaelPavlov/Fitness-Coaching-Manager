import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { BuilderComponent } from "./component/builder.component";
import { BuilderRoutingModule } from "./builder-routing.module";

@NgModule({
    declarations: [BuilderComponent],
    imports: [
      SharedModule,
      BuilderRoutingModule
    ],
    exports: [],
  })
  export class BuilderModule {}
  