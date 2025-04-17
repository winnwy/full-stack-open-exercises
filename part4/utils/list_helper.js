const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, cur) => acc + cur.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }
    return blogs.reduce((fav, blog)=>blog.likes > fav.likes ? blog: fav)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }
    const counts = {};

    blogs.forEach(blog => {
        counts[blog.author] = (counts[blog.author] || 0) + 1;
    });

    let maxAuthor = null;
    let maxCount = 0;

    for (const author in counts) {
        if (counts[author] > maxCount) {
            maxAuthor = author;
            maxCount = counts[author];
        }
    }

    return {
        author: maxAuthor,
        blogs: maxCount
    };
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }
    const counts = {};

    blogs.forEach(blog => {
        counts[blog.author] = (counts[blog.author] || 0) + blog.likes;
    })

    let maxAuthor = null;
    let maxCount = 0;

    for (const author in counts) {
        if (counts[author] > maxCount) {
            maxAuthor = author;
            maxCount = counts[author];
        }
    }

    return {
        author: maxAuthor,
        likes: maxCount
    };
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
} 