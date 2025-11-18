var FiltersEnabled = 0; // if your not going to use transitions or filters in any of the tips set this to 0
var spacer="&nbsp; &nbsp; &nbsp; ";

// email notifications to admin
notifyAdminNewMembers0Tip=["", spacer+"No email notifications to admin."];
notifyAdminNewMembers1Tip=["", spacer+"Notify admin only when a new member is waiting for approval."];
notifyAdminNewMembers2Tip=["", spacer+"Notify admin for all new sign-ups."];

// visitorSignup
visitorSignup0Tip=["", spacer+"If this option is selected, visitors will not be able to join this group unless the admin manually moves them to this group from the admin area."];
visitorSignup1Tip=["", spacer+"If this option is selected, visitors can join this group but will not be able to sign in unless the admin approves them from the admin area."];
visitorSignup2Tip=["", spacer+"If this option is selected, visitors can join this group and will be able to sign in instantly with no need for admin approval."];

// circle_members table
circle_members_addTip=["",spacer+"This option allows all members of the group to add records to the 'Circle members' table. A member who adds a record to the table becomes the 'owner' of that record."];

circle_members_view0Tip=["",spacer+"This option prohibits all members of the group from viewing any record in the 'Circle members' table."];
circle_members_view1Tip=["",spacer+"This option allows each member of the group to view only his own records in the 'Circle members' table."];
circle_members_view2Tip=["",spacer+"This option allows each member of the group to view any record owned by any member of the group in the 'Circle members' table."];
circle_members_view3Tip=["",spacer+"This option allows each member of the group to view all records in the 'Circle members' table."];

circle_members_edit0Tip=["",spacer+"This option prohibits all members of the group from modifying any record in the 'Circle members' table."];
circle_members_edit1Tip=["",spacer+"This option allows each member of the group to edit only his own records in the 'Circle members' table."];
circle_members_edit2Tip=["",spacer+"This option allows each member of the group to edit any record owned by any member of the group in the 'Circle members' table."];
circle_members_edit3Tip=["",spacer+"This option allows each member of the group to edit any records in the 'Circle members' table, regardless of their owner."];

circle_members_delete0Tip=["",spacer+"This option prohibits all members of the group from deleting any record in the 'Circle members' table."];
circle_members_delete1Tip=["",spacer+"This option allows each member of the group to delete only his own records in the 'Circle members' table."];
circle_members_delete2Tip=["",spacer+"This option allows each member of the group to delete any record owned by any member of the group in the 'Circle members' table."];
circle_members_delete3Tip=["",spacer+"This option allows each member of the group to delete any records in the 'Circle members' table."];

// circles table
circles_addTip=["",spacer+"This option allows all members of the group to add records to the 'Circles' table. A member who adds a record to the table becomes the 'owner' of that record."];

circles_view0Tip=["",spacer+"This option prohibits all members of the group from viewing any record in the 'Circles' table."];
circles_view1Tip=["",spacer+"This option allows each member of the group to view only his own records in the 'Circles' table."];
circles_view2Tip=["",spacer+"This option allows each member of the group to view any record owned by any member of the group in the 'Circles' table."];
circles_view3Tip=["",spacer+"This option allows each member of the group to view all records in the 'Circles' table."];

circles_edit0Tip=["",spacer+"This option prohibits all members of the group from modifying any record in the 'Circles' table."];
circles_edit1Tip=["",spacer+"This option allows each member of the group to edit only his own records in the 'Circles' table."];
circles_edit2Tip=["",spacer+"This option allows each member of the group to edit any record owned by any member of the group in the 'Circles' table."];
circles_edit3Tip=["",spacer+"This option allows each member of the group to edit any records in the 'Circles' table, regardless of their owner."];

circles_delete0Tip=["",spacer+"This option prohibits all members of the group from deleting any record in the 'Circles' table."];
circles_delete1Tip=["",spacer+"This option allows each member of the group to delete only his own records in the 'Circles' table."];
circles_delete2Tip=["",spacer+"This option allows each member of the group to delete any record owned by any member of the group in the 'Circles' table."];
circles_delete3Tip=["",spacer+"This option allows each member of the group to delete any records in the 'Circles' table."];

// followers table
followers_addTip=["",spacer+"This option allows all members of the group to add records to the 'Followers' table. A member who adds a record to the table becomes the 'owner' of that record."];

followers_view0Tip=["",spacer+"This option prohibits all members of the group from viewing any record in the 'Followers' table."];
followers_view1Tip=["",spacer+"This option allows each member of the group to view only his own records in the 'Followers' table."];
followers_view2Tip=["",spacer+"This option allows each member of the group to view any record owned by any member of the group in the 'Followers' table."];
followers_view3Tip=["",spacer+"This option allows each member of the group to view all records in the 'Followers' table."];

followers_edit0Tip=["",spacer+"This option prohibits all members of the group from modifying any record in the 'Followers' table."];
followers_edit1Tip=["",spacer+"This option allows each member of the group to edit only his own records in the 'Followers' table."];
followers_edit2Tip=["",spacer+"This option allows each member of the group to edit any record owned by any member of the group in the 'Followers' table."];
followers_edit3Tip=["",spacer+"This option allows each member of the group to edit any records in the 'Followers' table, regardless of their owner."];

followers_delete0Tip=["",spacer+"This option prohibits all members of the group from deleting any record in the 'Followers' table."];
followers_delete1Tip=["",spacer+"This option allows each member of the group to delete only his own records in the 'Followers' table."];
followers_delete2Tip=["",spacer+"This option allows each member of the group to delete any record owned by any member of the group in the 'Followers' table."];
followers_delete3Tip=["",spacer+"This option allows each member of the group to delete any records in the 'Followers' table."];

// friends table
friends_addTip=["",spacer+"This option allows all members of the group to add records to the 'Friends' table. A member who adds a record to the table becomes the 'owner' of that record."];

friends_view0Tip=["",spacer+"This option prohibits all members of the group from viewing any record in the 'Friends' table."];
friends_view1Tip=["",spacer+"This option allows each member of the group to view only his own records in the 'Friends' table."];
friends_view2Tip=["",spacer+"This option allows each member of the group to view any record owned by any member of the group in the 'Friends' table."];
friends_view3Tip=["",spacer+"This option allows each member of the group to view all records in the 'Friends' table."];

friends_edit0Tip=["",spacer+"This option prohibits all members of the group from modifying any record in the 'Friends' table."];
friends_edit1Tip=["",spacer+"This option allows each member of the group to edit only his own records in the 'Friends' table."];
friends_edit2Tip=["",spacer+"This option allows each member of the group to edit any record owned by any member of the group in the 'Friends' table."];
friends_edit3Tip=["",spacer+"This option allows each member of the group to edit any records in the 'Friends' table, regardless of their owner."];

friends_delete0Tip=["",spacer+"This option prohibits all members of the group from deleting any record in the 'Friends' table."];
friends_delete1Tip=["",spacer+"This option allows each member of the group to delete only his own records in the 'Friends' table."];
friends_delete2Tip=["",spacer+"This option allows each member of the group to delete any record owned by any member of the group in the 'Friends' table."];
friends_delete3Tip=["",spacer+"This option allows each member of the group to delete any records in the 'Friends' table."];

// messages table
messages_addTip=["",spacer+"This option allows all members of the group to add records to the 'Messages' table. A member who adds a record to the table becomes the 'owner' of that record."];

messages_view0Tip=["",spacer+"This option prohibits all members of the group from viewing any record in the 'Messages' table."];
messages_view1Tip=["",spacer+"This option allows each member of the group to view only his own records in the 'Messages' table."];
messages_view2Tip=["",spacer+"This option allows each member of the group to view any record owned by any member of the group in the 'Messages' table."];
messages_view3Tip=["",spacer+"This option allows each member of the group to view all records in the 'Messages' table."];

messages_edit0Tip=["",spacer+"This option prohibits all members of the group from modifying any record in the 'Messages' table."];
messages_edit1Tip=["",spacer+"This option allows each member of the group to edit only his own records in the 'Messages' table."];
messages_edit2Tip=["",spacer+"This option allows each member of the group to edit any record owned by any member of the group in the 'Messages' table."];
messages_edit3Tip=["",spacer+"This option allows each member of the group to edit any records in the 'Messages' table, regardless of their owner."];

messages_delete0Tip=["",spacer+"This option prohibits all members of the group from deleting any record in the 'Messages' table."];
messages_delete1Tip=["",spacer+"This option allows each member of the group to delete only his own records in the 'Messages' table."];
messages_delete2Tip=["",spacer+"This option allows each member of the group to delete any record owned by any member of the group in the 'Messages' table."];
messages_delete3Tip=["",spacer+"This option allows each member of the group to delete any records in the 'Messages' table."];

// password_resets table
password_resets_addTip=["",spacer+"This option allows all members of the group to add records to the 'Password resets' table. A member who adds a record to the table becomes the 'owner' of that record."];

password_resets_view0Tip=["",spacer+"This option prohibits all members of the group from viewing any record in the 'Password resets' table."];
password_resets_view1Tip=["",spacer+"This option allows each member of the group to view only his own records in the 'Password resets' table."];
password_resets_view2Tip=["",spacer+"This option allows each member of the group to view any record owned by any member of the group in the 'Password resets' table."];
password_resets_view3Tip=["",spacer+"This option allows each member of the group to view all records in the 'Password resets' table."];

password_resets_edit0Tip=["",spacer+"This option prohibits all members of the group from modifying any record in the 'Password resets' table."];
password_resets_edit1Tip=["",spacer+"This option allows each member of the group to edit only his own records in the 'Password resets' table."];
password_resets_edit2Tip=["",spacer+"This option allows each member of the group to edit any record owned by any member of the group in the 'Password resets' table."];
password_resets_edit3Tip=["",spacer+"This option allows each member of the group to edit any records in the 'Password resets' table, regardless of their owner."];

password_resets_delete0Tip=["",spacer+"This option prohibits all members of the group from deleting any record in the 'Password resets' table."];
password_resets_delete1Tip=["",spacer+"This option allows each member of the group to delete only his own records in the 'Password resets' table."];
password_resets_delete2Tip=["",spacer+"This option allows each member of the group to delete any record owned by any member of the group in the 'Password resets' table."];
password_resets_delete3Tip=["",spacer+"This option allows each member of the group to delete any records in the 'Password resets' table."];

// post_comments table
post_comments_addTip=["",spacer+"This option allows all members of the group to add records to the 'Post comments' table. A member who adds a record to the table becomes the 'owner' of that record."];

post_comments_view0Tip=["",spacer+"This option prohibits all members of the group from viewing any record in the 'Post comments' table."];
post_comments_view1Tip=["",spacer+"This option allows each member of the group to view only his own records in the 'Post comments' table."];
post_comments_view2Tip=["",spacer+"This option allows each member of the group to view any record owned by any member of the group in the 'Post comments' table."];
post_comments_view3Tip=["",spacer+"This option allows each member of the group to view all records in the 'Post comments' table."];

post_comments_edit0Tip=["",spacer+"This option prohibits all members of the group from modifying any record in the 'Post comments' table."];
post_comments_edit1Tip=["",spacer+"This option allows each member of the group to edit only his own records in the 'Post comments' table."];
post_comments_edit2Tip=["",spacer+"This option allows each member of the group to edit any record owned by any member of the group in the 'Post comments' table."];
post_comments_edit3Tip=["",spacer+"This option allows each member of the group to edit any records in the 'Post comments' table, regardless of their owner."];

post_comments_delete0Tip=["",spacer+"This option prohibits all members of the group from deleting any record in the 'Post comments' table."];
post_comments_delete1Tip=["",spacer+"This option allows each member of the group to delete only his own records in the 'Post comments' table."];
post_comments_delete2Tip=["",spacer+"This option allows each member of the group to delete any record owned by any member of the group in the 'Post comments' table."];
post_comments_delete3Tip=["",spacer+"This option allows each member of the group to delete any records in the 'Post comments' table."];

// post_likes table
post_likes_addTip=["",spacer+"This option allows all members of the group to add records to the 'Post likes' table. A member who adds a record to the table becomes the 'owner' of that record."];

post_likes_view0Tip=["",spacer+"This option prohibits all members of the group from viewing any record in the 'Post likes' table."];
post_likes_view1Tip=["",spacer+"This option allows each member of the group to view only his own records in the 'Post likes' table."];
post_likes_view2Tip=["",spacer+"This option allows each member of the group to view any record owned by any member of the group in the 'Post likes' table."];
post_likes_view3Tip=["",spacer+"This option allows each member of the group to view all records in the 'Post likes' table."];

post_likes_edit0Tip=["",spacer+"This option prohibits all members of the group from modifying any record in the 'Post likes' table."];
post_likes_edit1Tip=["",spacer+"This option allows each member of the group to edit only his own records in the 'Post likes' table."];
post_likes_edit2Tip=["",spacer+"This option allows each member of the group to edit any record owned by any member of the group in the 'Post likes' table."];
post_likes_edit3Tip=["",spacer+"This option allows each member of the group to edit any records in the 'Post likes' table, regardless of their owner."];

post_likes_delete0Tip=["",spacer+"This option prohibits all members of the group from deleting any record in the 'Post likes' table."];
post_likes_delete1Tip=["",spacer+"This option allows each member of the group to delete only his own records in the 'Post likes' table."];
post_likes_delete2Tip=["",spacer+"This option allows each member of the group to delete any record owned by any member of the group in the 'Post likes' table."];
post_likes_delete3Tip=["",spacer+"This option allows each member of the group to delete any records in the 'Post likes' table."];

// post_saves table
post_saves_addTip=["",spacer+"This option allows all members of the group to add records to the 'Post saves' table. A member who adds a record to the table becomes the 'owner' of that record."];

post_saves_view0Tip=["",spacer+"This option prohibits all members of the group from viewing any record in the 'Post saves' table."];
post_saves_view1Tip=["",spacer+"This option allows each member of the group to view only his own records in the 'Post saves' table."];
post_saves_view2Tip=["",spacer+"This option allows each member of the group to view any record owned by any member of the group in the 'Post saves' table."];
post_saves_view3Tip=["",spacer+"This option allows each member of the group to view all records in the 'Post saves' table."];

post_saves_edit0Tip=["",spacer+"This option prohibits all members of the group from modifying any record in the 'Post saves' table."];
post_saves_edit1Tip=["",spacer+"This option allows each member of the group to edit only his own records in the 'Post saves' table."];
post_saves_edit2Tip=["",spacer+"This option allows each member of the group to edit any record owned by any member of the group in the 'Post saves' table."];
post_saves_edit3Tip=["",spacer+"This option allows each member of the group to edit any records in the 'Post saves' table, regardless of their owner."];

post_saves_delete0Tip=["",spacer+"This option prohibits all members of the group from deleting any record in the 'Post saves' table."];
post_saves_delete1Tip=["",spacer+"This option allows each member of the group to delete only his own records in the 'Post saves' table."];
post_saves_delete2Tip=["",spacer+"This option allows each member of the group to delete any record owned by any member of the group in the 'Post saves' table."];
post_saves_delete3Tip=["",spacer+"This option allows each member of the group to delete any records in the 'Post saves' table."];

// post_shares table
post_shares_addTip=["",spacer+"This option allows all members of the group to add records to the 'Post shares' table. A member who adds a record to the table becomes the 'owner' of that record."];

post_shares_view0Tip=["",spacer+"This option prohibits all members of the group from viewing any record in the 'Post shares' table."];
post_shares_view1Tip=["",spacer+"This option allows each member of the group to view only his own records in the 'Post shares' table."];
post_shares_view2Tip=["",spacer+"This option allows each member of the group to view any record owned by any member of the group in the 'Post shares' table."];
post_shares_view3Tip=["",spacer+"This option allows each member of the group to view all records in the 'Post shares' table."];

post_shares_edit0Tip=["",spacer+"This option prohibits all members of the group from modifying any record in the 'Post shares' table."];
post_shares_edit1Tip=["",spacer+"This option allows each member of the group to edit only his own records in the 'Post shares' table."];
post_shares_edit2Tip=["",spacer+"This option allows each member of the group to edit any record owned by any member of the group in the 'Post shares' table."];
post_shares_edit3Tip=["",spacer+"This option allows each member of the group to edit any records in the 'Post shares' table, regardless of their owner."];

post_shares_delete0Tip=["",spacer+"This option prohibits all members of the group from deleting any record in the 'Post shares' table."];
post_shares_delete1Tip=["",spacer+"This option allows each member of the group to delete only his own records in the 'Post shares' table."];
post_shares_delete2Tip=["",spacer+"This option allows each member of the group to delete any record owned by any member of the group in the 'Post shares' table."];
post_shares_delete3Tip=["",spacer+"This option allows each member of the group to delete any records in the 'Post shares' table."];

// posts table
posts_addTip=["",spacer+"This option allows all members of the group to add records to the 'Posts' table. A member who adds a record to the table becomes the 'owner' of that record."];

posts_view0Tip=["",spacer+"This option prohibits all members of the group from viewing any record in the 'Posts' table."];
posts_view1Tip=["",spacer+"This option allows each member of the group to view only his own records in the 'Posts' table."];
posts_view2Tip=["",spacer+"This option allows each member of the group to view any record owned by any member of the group in the 'Posts' table."];
posts_view3Tip=["",spacer+"This option allows each member of the group to view all records in the 'Posts' table."];

posts_edit0Tip=["",spacer+"This option prohibits all members of the group from modifying any record in the 'Posts' table."];
posts_edit1Tip=["",spacer+"This option allows each member of the group to edit only his own records in the 'Posts' table."];
posts_edit2Tip=["",spacer+"This option allows each member of the group to edit any record owned by any member of the group in the 'Posts' table."];
posts_edit3Tip=["",spacer+"This option allows each member of the group to edit any records in the 'Posts' table, regardless of their owner."];

posts_delete0Tip=["",spacer+"This option prohibits all members of the group from deleting any record in the 'Posts' table."];
posts_delete1Tip=["",spacer+"This option allows each member of the group to delete only his own records in the 'Posts' table."];
posts_delete2Tip=["",spacer+"This option allows each member of the group to delete any record owned by any member of the group in the 'Posts' table."];
posts_delete3Tip=["",spacer+"This option allows each member of the group to delete any records in the 'Posts' table."];

// users table
users_addTip=["",spacer+"This option allows all members of the group to add records to the 'Users' table. A member who adds a record to the table becomes the 'owner' of that record."];

users_view0Tip=["",spacer+"This option prohibits all members of the group from viewing any record in the 'Users' table."];
users_view1Tip=["",spacer+"This option allows each member of the group to view only his own records in the 'Users' table."];
users_view2Tip=["",spacer+"This option allows each member of the group to view any record owned by any member of the group in the 'Users' table."];
users_view3Tip=["",spacer+"This option allows each member of the group to view all records in the 'Users' table."];

users_edit0Tip=["",spacer+"This option prohibits all members of the group from modifying any record in the 'Users' table."];
users_edit1Tip=["",spacer+"This option allows each member of the group to edit only his own records in the 'Users' table."];
users_edit2Tip=["",spacer+"This option allows each member of the group to edit any record owned by any member of the group in the 'Users' table."];
users_edit3Tip=["",spacer+"This option allows each member of the group to edit any records in the 'Users' table, regardless of their owner."];

users_delete0Tip=["",spacer+"This option prohibits all members of the group from deleting any record in the 'Users' table."];
users_delete1Tip=["",spacer+"This option allows each member of the group to delete only his own records in the 'Users' table."];
users_delete2Tip=["",spacer+"This option allows each member of the group to delete any record owned by any member of the group in the 'Users' table."];
users_delete3Tip=["",spacer+"This option allows each member of the group to delete any records in the 'Users' table."];

/*
	Style syntax:
	-------------
	[TitleColor,TextColor,TitleBgColor,TextBgColor,TitleBgImag,TextBgImag,TitleTextAlign,
	TextTextAlign,TitleFontFace,TextFontFace, TipPosition, StickyStyle, TitleFontSize,
	TextFontSize, Width, Height, BorderSize, PadTextArea, CoordinateX , CoordinateY,
	TransitionNumber, TransitionDuration, TransparencyLevel ,ShadowType, ShadowColor]

*/

toolTipStyle=["white","#00008B","#000099","#E6E6FA","","images/helpBg.gif","","","","\"Trebuchet MS\", sans-serif","","","","3",400,"",1,2,10,10,51,1,0,"",""];

applyCssFilter();
