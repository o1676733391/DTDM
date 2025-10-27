import { supabase } from "../configs/db.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    await whook.verify(JSON.stringify(req.body), headers);

    const { data, type } = req.body;
    const userData = {
      id: data.id,
      email: data.email_addresses[0].email_address,
      username: data.first_name + " " + data.last_name,
      image: data.image_url,
      role: 'USER',
      recent_searched_cities: []
    };

    switch (type) {
      case "user.created": {
        const { error } = await supabase
          .from('users')
          .insert(userData);
        
        if (error) {
          console.log('User creation error:', error.message);
        }
        break;
      }

      case "user.updated": {
        const { error } = await supabase
          .from('users')
          .update({
            email: userData.email,
            username: userData.username,
            image: userData.image
          })
          .eq('id', data.id);
        
        if (error) {
          console.log('User update error:', error.message);
        }
        break;
      }

      case "user.deleted": {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', data.id);
        
        if (error) {
          console.log('User deletion error:', error.message);
        }
        break;
      }

      default:
        break;
    }
    res.json({ success: true, message: "Webhook Received" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
