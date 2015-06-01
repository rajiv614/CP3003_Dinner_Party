# CP3003_Dinner_Party

<h1>Your Dinner Event</h1>

<h2>Set up instructions</h2>

	•	 Host folder using xampp or anything else (make sure the port number is same as what xampp uses )

	•	If you are on linux/Mac you can navigate to this folder in the ‘terminal’ app and enter this command ‘python -m SimpleHTTPServer 8000’  to host the site locally . Note this is an alternative to  thee previous step. (Xampp)

	•	 Navigate to port where you have hosted the site (e.g  http://localhost:8000/ )

	•	  Alternatively you can visit the same project which we have hosted on a web server at http://rajiv614.github.io/CP3003_Dinner_Party/ 

	•	Use the credentials provided in the documentation to log in . 

	•	Backend is hosted on parse.com . Credentials to view tables , cloud code etc are also available in the documentation

———————————————————————————————————————————————————

<h2>Test cases/ Navigation</h2> 

	•	Log in using credentials provided in Docs

	

<h3> <b> TASK/Case </b> = View Upcoming event and commit groceries Flow </h3>

1. Click on any event in the ‘upcoming events’ list on home.html
Expected Result ==> Will navigate to viewEvent.html

2. On viewEvent page click on an item in the Grocery List and press the ‘’commit to bring selected grocery’ button
 Expected Result ==> alert will appear with the following text - ‘Success: Host has been notified’ . <br>
			    On returning to home.html (by pressing ‘home’ in navbar)  the selected grocery will now appear under the reminders panel with the event name and date. 


<h3><b> TASK/Case </b>  = View new invite  and accept invitation Flow </h3>

1. Click on an event in the ‘Invitations’ panel on home.html 
Expected Result ==> Will navigate to viewEvent.html

2. Click the ‘Join’ button on viewEvent.html
Expected Result ==> Join & Decline buttons will disappear since user has accepted/ declined.

3. Press the ‘Home button’ on the top-right on the nav-bar  
Expected Result ==> Will navigate to Home.html <br >
			    On the home/ dashboard page the event which was clicked in step 1 will no longer be under the invitations panel but will now be in the ‘upcoming events ’ panel.


<h3><b> TASK/Case </b> = View my Profile</h3>
1. Click on ‘’My Profile’ on the top right navigation bar <br>
Expected Result ==> Will navigate to profile.html - 
			    Page will contain user image, food preferences, food restrictions & Friend List.


<h3><b> TASK/Case </b> = Create Event Flow </h3>

1. Click on ‘’ Create Event’’ button on the top right Nav Bar
Expected Result ==> Will navigate to createEvent.html

2. Fill in Name, Description , Address & Date/Time as these are compulsory fields.

3. Click on a friend in the friend list on the right to add them to the invite list
Expected Result ==> Name of the selected friend will be appended to ‘Invite List ’ Box

4. Press the ‘Add  food options’ button 
Expected Result ==> Will navigate to createEvent2.html . - 
			    On createEvent2.html an  accordion containing ‘Cuisine Preferences’ and ‘Dietary Restrictions’ of the users invited in Step 3 will be displayed so that user can set the menu accordingly .

5. On createEvent2.html enter a name of a dish in the dish text field and press the add button. 
Expected Result ==> The dish inputted by the user will appear in the Menu List

6. Select the dish added to menu list in previous step and click the ‘Search Recipe ’ button
Expected Result ==> A new tab will open in the browser which will display the recipe of the selected item from the menu. The user can look at this recipe and start populating the grocery list (next step)

7. Add name of groceries required in the text field below “Add Groceries needed” and press the add button
Expected Result ==> The grocery item entered by the user will appear in the Grocery List.

8.  Press ‘Create Event’ button
Expected Result ==> 
<ul> <li>An alert box with text “Success” will appear and the user will be navigated to home.html (Dashboard) </li>
			    <li> On Home.html (dashboard ) the event created in this step will appear under the ‘’hosting’ tab under the ‘Upcoming Events’ Panel. </li> </ul>


<h3> <b> TASK/Case </b>  = View Event hosted by current user  (Host View) </h3>

1. Click on any event under the ‘’Hosting Tab’ in the ‘Upcoming Events’ panel on home.html (Dashboard)
Expected Result ==> <br> 
				<ul>
				<li> Will navigate to viewEvent.html </li>
			    <li> Will display event information </li>
			    <li>Will contain a panel called ‘Who is Coming’ which will contain 2 tabs </li>
			    <li>First tab which is called ‘attending ’ will contain a list of guest who have confirmed their attendance</li>
			    <li>Second Tab called ‘invited’ will contain a list of users who have been invited but have not yet responded to the invitation.</li>
			    <li> The ‘Pending Grocery List’ will contain a list of grocery items that no guest has committed to bring yet. </li>
			   <li> Other grocery items that a guest has already committed to bring will not be visible in this list. 	</li>
</ul>



———————————————————————————————————————————————————








