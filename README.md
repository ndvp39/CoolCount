![image](https://github.com/user-attachments/assets/288d598c-62f4-42e0-90d1-b726f30fb4b2)![image](https://github.com/user-attachments/assets/1079f13b-7709-4029-b131-10a528b4e3f8)# CoolCount

**CoolCount** is a smart application designed to manage refrigerator inventory visually and efficiently. It allows users to track items in their refrigerator, estimate item quantities based on weight, and maintain better household inventory management.

link to app: https://coolcount-client.vercel.app/
---

## Key Features

1. **Visual Refrigerator Display:**
   - A graphical interface displays the refrigerator divided into drawers.
   - Each drawer represents a physical drawer and shows the estimated quantity of items based on their weight.

2. **Weight-to-Quantity Conversion:**
   - Calculates the estimated quantity of items in each drawer using their total weight and the average weight of each item type.

3. **Real-Time Monitoring:**
   - Integrated with Arduino-based weight sensors to monitor the weight of items in real-time.

4. **Alerts for Low Stock:**
   - Configurable alerts notify users when the quantity of an item in a drawer falls below a user-set threshold.
  
5. **Shopping List:**
   - Users can manually create a shopping list based on products that fall below their predefined thresholds.

6. **Recipe Suggestions:**
   - Search for recipes based on available refrigerator items.

7. **Data Storage and Analysis:**
   - Firebase stores the current weight data for each drawer.

---

## Technology Stack

- **Front-End:** React
- **Back-End:** Node.js
- **Database:** Firebase
- **Hardware:** Arduino-based weight sensors
- **Development Environment:** VS Code

---

## How It Works

1. **Sensor Setup:**
   - Each refrigerator drawer is equipped with a small weight sensor to measure the total weight of items.

2. **Data Processing:**
   - The Arduino sends weight data to a Node.js server, which forwards it to Firebase.
   - The app calculates the weight of each drawer based on the average weight of a single item type in the drawer.
   - A built-in weight calculation tool in the app helps users calculate and set the average weight for each item type.
     
3. **User Interaction:**
   - Users can view the refrigerator's graphical layout, manually manage their shopping list, configure alerts, and explore recipes.

---

## Hardware Requirements

**To set up the hardware for CoolCount, the following components are used:**

1. **Arduino Mega 2560**
   - Main microcontroller board for managing sensor inputs and sending data to the server.
     
2. **ESP Module (ESP32)**
   - Provides wireless connectivity for transmitting data to the Node.js server.
     
3. **Load Cells**
   - Weight sensors used to measure the total weight of items in each drawer.
     
4. **HX711 Amplifier Modules**
   - Converts the analog signals from the load cells into digital signals for the Arduino.
     
5. **Wires and Connectors**
   - For connecting the components.
    
6. **Power Supply**
   - Powers the Arduino and sensors.

---
## System architecture
![image](https://github.com/user-attachments/assets/9396bcc6-7d5a-4243-9c62-e84972153327)

## Images
<img src="https://media.licdn.com/dms/image/v2/D4D22AQFoBZnYjL8aew/feedshare-shrink_1280/B4DZPgIuDBG0Ao-/0/1734632204022?e=1748476800&v=beta&t=a2YScyb8o72UnpFAwypg_k6OiA295_GvoHX5CQkEvVk" width=400>

<img src="https://media.licdn.com/dms/image/v2/D4D22AQFmW455VI-4_A/feedshare-shrink_800/B4DZPgIuDDHUAk-/0/1734632203635?e=1748476800&v=beta&t=qd2dhrtbzmhvIsHJHIrCOZUV0UJai0yNcBKTPmbK7nw" width=400>
