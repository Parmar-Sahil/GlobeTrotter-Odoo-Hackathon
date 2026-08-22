import app from '../src/app';
import { prisma } from '../src/config/prisma.config';
import http from 'http';

let server: http.Server;
const PORT = 5055;
const BASE_URL = `http://localhost:${PORT}`;

async function testEndpoint(name: string, fn: () => Promise<boolean>) {
  try {
    const success = await fn();
    if (success) {
      console.log(`✅ [PASS] ${name}`);
    } else {
      console.error(`❌ [FAIL] ${name}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ [ERROR] ${name}:`, error);
    process.exit(1);
  }
}

async function runTests() {
  console.log('🧪 Starting 14-Table Official Schema Integration Verification Tests...\n');

  server = app.listen(PORT);

  let authToken = '';
  let userId = '';
  let tripId = '';
  let stopId = '';
  let cityId = '';
  let activityId = '';
  let postId = '';

  // 1. Health Check
  await testEndpoint('Health Check Endpoint (GET /api/health)', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    return res.status === 200 && data.success === true;
  });

  // 2. Auth Register (Screen 2)
  await testEndpoint('User Registration (POST /api/v1/auth/register)', async () => {
    const testUsername = `user_${Date.now()}`;
    const testEmail = `user_${Date.now()}@example.com`;
    const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        username: testUsername,
        city: 'San Francisco',
        country: 'USA',
        bio: 'Automated test user profile',
      }),
    });
    const data = await res.json();
    if (res.status === 201 && data.data?.token) {
      authToken = data.data.token;
      userId = data.data.user.id;
      return true;
    }
    return false;
  });

  // 3. Auth Login (Screen 1)
  await testEndpoint('User Login (POST /api/v1/auth/login)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'admin@globetrotter.com',
        password: 'password123',
      }),
    });
    const data = await res.json();
    return res.status === 200 && data.success === true && !!data.data.token;
  });

  // 4. Profile (Screen 7)
  await testEndpoint('Get Profile (GET /api/v1/auth/me)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await res.json();
    return res.status === 200 && data.data?.id === userId;
  });

  // 5. Update Profile (Screen 7)
  await testEndpoint('Update Profile (PUT /api/v1/users/profile)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        bio: 'Updated bio via automated test suite',
        city: 'San Francisco',
      }),
    });
    const data = await res.json();
    return res.status === 200 && data.data?.bio === 'Updated bio via automated test suite';
  });

  // 6. Top Regional Destinations (Screen 3)
  await testEndpoint('Top Regional Selections (GET /api/v1/destinations/top-regional)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/destinations/top-regional`);
    const data = await res.json();
    if (res.status === 200 && data.data) {
      const keys = Object.keys(data.data);
      if (keys.length > 0) {
        const firstRegion = data.data[keys[0]];
        if (firstRegion.length > 0) {
          cityId = firstRegion[0].id;
        }
      }
      return true;
    }
    return false;
  });

  // 7. Search Destinations (Screen 3 & 8)
  await testEndpoint('Search Destinations (GET /api/v1/destinations/search)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/destinations/search?search=Paris`);
    const data = await res.json();
    return res.status === 200 && Array.isArray(data.data);
  });

  // 8. Search Activities (Screen 8)
  await testEndpoint('Search Activities (GET /api/v1/activities/search)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/activities/search?sortBy=popularityScore&sortOrder=desc`);
    const data = await res.json();
    if (res.status === 200 && Array.isArray(data.data) && data.data.length > 0) {
      activityId = data.data[0].id;
      return true;
    }
    return false;
  });

  // 9. Create Trip (Screen 4)
  await testEndpoint('Create New Trip (POST /api/v1/trips)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: 'Official 14-Table Test Trip',
        cityId: cityId || undefined,
        startDate: '2026-11-01',
        endDate: '2026-11-07',
        totalBudget: 2000.0,
        notes: 'Testing trip creation flow',
      }),
    });
    const data = await res.json();
    if (res.status === 201 && data.data?.id) {
      tripId = data.data.id;
      return true;
    }
    return false;
  });

  // 10. Add Stop to Trip (Screen 5)
  await testEndpoint('Add Stop to Trip (POST /api/v1/trips/:id/sections)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/trips/${tripId}/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        cityId: cityId || undefined,
        title: 'Stop 1: Paris Sightseeing',
        stopOrder: 1,
      }),
    });
    const data = await res.json();
    if (res.status === 201 && data.data?.id) {
      stopId = data.data.id;
      return true;
    }
    return false;
  });

  // 11. Add Itinerary Item (Screen 5)
  await testEndpoint('Add Itinerary Item (POST /api/v1/trips/sections/:stopId/items)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/trips/sections/${stopId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        activityId: activityId || undefined,
        title: 'Eiffel Tower Guided Summit Visit',
        itemType: 'activity',
        costEstimate: 150.0,
        startTime: '10:00 AM',
        endTime: '01:00 PM',
      }),
    });
    const data = await res.json();
    return res.status === 201 && data.data?.id !== undefined;
  });

  // 12. Get Itinerary (Screen 9)
  await testEndpoint('Get Trip Itinerary (GET /api/v1/trips/:id/itinerary)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/trips/${tripId}/itinerary`);
    const data = await res.json();
    return res.status === 200 && data.data?.dayWiseItinerary !== undefined;
  });

  // 13. Get Budget Summary (Screen 9)
  await testEndpoint('Get Budget Summary (GET /api/v1/trips/:id/budget-summary)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/trips/${tripId}/budget-summary`);
    const data = await res.json();
    return res.status === 200 && data.data?.totalActualExpense !== undefined;
  });

  // 14. User Trip Listing (Screen 6)
  await testEndpoint('User Trip Listing (GET /api/v1/trips/my-trips)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/trips/my-trips?status=upcoming`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await res.json();
    return res.status === 200 && Array.isArray(data.data);
  });

  // 15. Calendar View (Screen 11)
  await testEndpoint('Calendar View (GET /api/v1/trips/calendar)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/trips/calendar`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await res.json();
    return res.status === 200 && Array.isArray(data.data);
  });

  // 16. Community Post (Screen 10)
  await testEndpoint('Create Community Post (POST /api/v1/community/posts)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/community/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        tripId,
        title: 'Awesome Paris Trip Experience!',
        body: 'I had an incredible time exploring Paris with GlobeTrotter!',
      }),
    });
    const data = await res.json();
    if (res.status === 201 && data.data?.id) {
      postId = data.data.id;
      return true;
    }
    return false;
  });

  // 17. Toggle Post Like (Screen 10)
  await testEndpoint('Toggle Post Like (POST /api/v1/community/posts/:id/like)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/community/posts/${postId}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await res.json();
    return res.status === 200 && data.data?.isLiked === true;
  });

  // 18. Add Post Comment (Screen 10)
  await testEndpoint('Add Post Comment (POST /api/v1/community/posts/:id/comments)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/community/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ content: 'Great post! Enjoyed reading it.' }),
    });
    const data = await res.json();
    return res.status === 201 && data.data?.id !== undefined;
  });

  server.close();
  await prisma.$disconnect();
  console.log('\n🎉 ALL 18 INTEGRATION TESTS PASSED WITH 100% SUCCESS FOR THE OFFICIAL 14-TABLE SCHEMA!');
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  if (server) server.close();
  process.exit(1);
});
