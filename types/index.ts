type Recipe = {
  id: string;
  createdTime: number;
  author: {
    authorName: string;
    authorAvatar: string;
    authorID: string;
  };
  title: string;
  image: string;
  prepTime: number;
  // cookTime: number;
  level: string;
  source: string;
  portion: number;
  category: string[];
  shortInfo: string;
  ingredients: {
    id: string;
    cate: string;
    names: string[];
  }[];
  steps: string[];
  description?: string;
  likes: string[];
  comments: {
    id: string;
    user: {
      uid: string;
      name: string;
      avatar: string;
    };
    text: string;
  }[];
};

type RecipeTypeList = {
  id: string;
  title: string;
  image: string;
  prepTime: number;
  // cookTime: number;
  level: string;
  portion: number;
  author: {
    authorName: string;
    authorAvatar: string;
    authorID: string;
  };
  category: string[];
  likes: string[];
};

type User = {
  userName: string;
  activeUser: boolean;
  avatar: string;
  id: string;
  email: string;
};

type BackupData = {};

type ContextTypes = {
  activeUser: any;
  name: string;
  isLogin: boolean;
  loading: boolean;
  email: string;
  avatar: string;
  modalName: boolean;
  editRecipe: any;
  setEditRecipe: (editRecipe: any) => void;
  setIsLogin: (isLogin: boolean) => void;
  setName: (name: string) => void;
  setModalName: (modalName: boolean) => void;
  setAvatar: (avatar: string) => void;
  setLoading: (loading: boolean) => void;
  file: any;
  setFile: (file: any) => void;
};

type CloudinaryContextTypes = {
  loaded: boolean;
};
