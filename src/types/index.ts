// User/Author types
export interface Author {
 _id?: string;
 name: string;
 email: string;
 bio: string;
 photo?: string;
 articles?: string[];
 createdAt?: string;
}

// Category types
export interface Category {
 _id?: string;
 name: string;
 slug: string;
 description?: string;
 createdAt?: string;
}

// Article types
export interface Article {
 _id?: string;
 title: string;
 slug: string;
 content: string;
 excerpt: string;
 featuredImage?: string;
 category: Category | string;
 author: Author | string;
 publishedAt: string;
 updatedAt?: string;
 views?: number;
 status: 'draft' | 'published' | 'archived';
 tags?: string[];
 featured?: boolean;
}

// Article submission types
export interface ArticleSubmission {
 _id?: string;
 title: string;
 content: string;
 category: string;
 authorName: string;
 authorEmail: string;
 image?: string;
 status: 'pending' | 'approved' | 'rejected';
 submittedAt?: string;
 rejectionReason?: string;
}

// Contact form types
export interface ContactMessage {
 _id?: string;
 name: string;
 email: string;
 message: string;
 createdAt?: string;
 status: 'new' | 'read' | 'responded';
}

// SEO types
export interface SEOMetadata {
 title: string;
 description: string;
 keywords?: string[];
 ogImage?: string;
 ogType?: string;
 twitterCard?: string;
}







