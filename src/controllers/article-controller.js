

export const getTopRatedArticles = ()=>{

}
export const addCommentController = ()=>{

}

export const likeArticleController=()=>{

}

export const deleteArticleController=()=>{

}

export const updateArticleController=()=>{

}

export const getArticleController = ()=>{

}

export const getArticlesController = ()=>{

}

export const createArticleController = (req,res,next)=>{
    try{
        const res = req.body;
        const file = req.file;
        console.log(res,file);

    }catch(err){

    }
}