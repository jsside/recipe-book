export interface Chef {
  name: string;
  avatar: string;
  recipeCount: number;
}

export interface ChefCardProps {
  chef: Chef;
}
