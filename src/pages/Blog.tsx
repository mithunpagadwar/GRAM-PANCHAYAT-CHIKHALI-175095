import React, { useState } from 'react';
import { BlogPost } from '../types';

interface BlogProps {
  posts: BlogPost[];
}

// Sub-component for individual Blog Cards to handle Play state
const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    // Robust Regex for all YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length >= 11) ? match[2].slice(0, 11) : null;
  };

  const videoId = post.mediaType === 'youtube' && post.mediaUrl ? getYouTubeId(post.mediaUrl) : null;

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      <div className="h-56 bg-black relative group">
        {/* IMAGE TYPE */}
        {post.mediaType === 'image' && post.mediaUrl && (
          <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
        )}

        {/* YOUTUBE TYPE - CLICK TO PLAY Implementation */}
        {post.mediaType === 'youtube' && (
           videoId ? (
             isPlaying ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&origin=${window.location.origin}`} 
                  title={post.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
             ) : (
                <div 
                  className="w-full h-full cursor-pointer relative"
                  onClick={() => setIsPlaying(true)}
                >
                   {/* High Quality Thumbnail */}
                   <img 
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                      alt="Video Thumbnail" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                   />
                   {/* Play Button Overlay */}
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <i className="fas fa-play text-white text-2xl ml-1"></i>
                      </div>
                   </div>
                   <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Tap to Play
                   </div>
                </div>
             )
           ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white flex-col p-4">
                  <i className="fab fa-youtube text-5xl mb-2 text-gray-600"></i>
                  <span className="text-sm text-gray-400">Video Link Broken</span>
              </div>
           )
        )}

        {/* NATIVE VIDEO TYPE */}
        {post.mediaType === 'video' && post.mediaUrl && (
            <video 
              src={post.mediaUrl} 
              controls 
              className="w-full h-full object-contain bg-black"
            >
              Your browser does not support video tag.
            </video>
        )}

        {/* NO MEDIA FALLBACK */}
        {((!post.mediaUrl) && post.mediaType !== 'youtube') && (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <i className="fas fa-newspaper text-5xl opacity-20"></i>
          </div>
        )}
        
        {/* DATE BADGE */}
        <div className="absolute top-0 right-0 bg-gov-secondary text-white px-3 py-1 text-xs font-bold shadow-md rounded-bl-lg z-10">
          {post.publishDate}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col relative">
        <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2 leading-tight">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3 whitespace-pre-line">{post.content}</p>
        
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 mt-auto">
          <span className="flex items-center gap-1"><i className="fas fa-user-circle text-gov-primary"></i> {post.author}</span>
          
          {post.mediaType === 'youtube' && videoId && (
            <a 
              href={`https://www.youtube.com/watch?v=${videoId}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
            >
               Watch on App <i className="fas fa-external-link-alt"></i>
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export const Blog: React.FC<BlogProps> = ({ posts }) => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gov-primary uppercase tracking-wide">Village News & Updates</h2>
        <p className="text-gray-500 mt-2">Latest happenings in Gram Panchayat Chikhali</p>
        <div className="w-24 h-1 bg-gov-accent mx-auto mt-4 rounded-full"></div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
           <i className="far fa-newspaper text-6xl mb-4"></i>
           <p className="text-xl">No news posted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
             <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};