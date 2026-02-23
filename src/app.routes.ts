import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home.component";
import { CategoryComponent } from "./pages/category.component";
import { ProductComponent } from "./pages/product.component";
import { StaticPageComponent } from "./pages/static-page.component";
import { SearchComponent } from "./pages/search.component";
import { ReviewsComponent } from "./pages/reviews.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "reviews", component: ReviewsComponent },
  { path: "category/:id", component: CategoryComponent }, // Kept for legacy support
  { path: "review/:slug", component: ProductComponent }, // <-- ALTERADO AQUI (de :id para :slug)
  { path: "search", component: SearchComponent },
  { path: "about", component: StaticPageComponent, data: { page: "about" } },
  {
    path: "privacy",
    component: StaticPageComponent,
    data: { page: "privacy" },
  },
  {
    path: "disclaimer",
    component: StaticPageComponent,
    data: { page: "disclaimer" },
  },
  // Mudei aqui para 'accessibility' para bater com o link do rodapé
  {
    path: "accessibility",
    component: StaticPageComponent,
    data: { page: "accessibility" },
  },
  { path: "**", redirectTo: "" },
];