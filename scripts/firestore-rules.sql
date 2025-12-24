-- Firestore Security Rules for Books Collection
-- Copy these rules to your Firebase Console > Firestore Database > Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Books collection rules
    match /books/{bookId} {
      // Allow read/write if user is authenticated and owns the book
      allow read, write: if request.auth != null && 
                         request.auth.uid == resource.data.userId;
      
      // Allow create if user is authenticated and setting themselves as owner
      allow create: if request.auth != null && 
                    request.auth.uid == request.resource.data.userId;
    }
    
    // Users collection rules (if you add user profiles later)
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                         request.auth.uid == userId;
    }
  }
}
