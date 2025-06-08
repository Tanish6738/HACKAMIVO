const API_URL = "https://krish09bha-dhruvai.hf.space"; // Updated to actual API URL from documentation

export interface LostPersonData {
  name: string;
  gender: string;
  age: number;
  where_lost: string;
  your_name: string;
  relation_with_lost: string;
  user_id: string;
  mobile_no: string;
  email_id: string;
  file: File;
}

export interface FoundPersonData {
  name: string;
  gender: string;
  age: number;
  where_found: string;
  your_name: string;
  organization: string;
  designation: string;
  user_id: string;
  mobile_no: string;
  email_id: string;
  file: File;
}

export interface LiveFeedData {
  camera_id: string;
  where_found: string;
  location: string;
  your_name: string;
  organization: string;
  designation: string;
  user_id: string;
  mobile_no: string;
  email_id: string;
  file: Blob;
}

export interface MatchedRecord {
  match_id: string;
  source: any;
  matched_with: {
    face_id: string;
    name: string;
    gender: string;
    age: number;
    where_found?: string;
    where_lost?: string;
    reporter_name: string;
    organization?: string;
    designation?: string;
    relation_with_lost?: string;
    user_id: string;
    contact_details: {
      mobile_no: string;
      email_id: string;
    };
    face_blob: string;
    face_path?: string;
    emotion?: string;
    status?: string;
    upload_time?: string;
    _id?: string;
  };
  face_path: string;
}

export interface RecordItem {
  folder: string;
  metadata: {
    face_id: string;
    name: string;
    gender: string;
    age: number;
    where_lost?: string;
    where_found?: string;
    reporter_name: string;
    relation_with_lost?: string;
    organization?: string;
    designation?: string;
    user_id: string;
    contact_details: {
      mobile_no: string;
      email_id: string;
    };
    face_blob: string;
    face_path?: string;
    emotion?: string;
    status?: string;
    upload_time?: string;
    _id?: string;
  };
}

export interface RecordsResponse {
  message: string;
  records: RecordItem[];
}

export interface LostPersonResponse {
  message: string;
  matched_found: any[]; // Array of matched found person records
}

export interface FoundPersonResponse {
  message: string;
  matched_lost: any[]; // Array of matched lost person records
}

export interface LiveFeedResponse {
  message: string;
  metadata: any; // Metadata object as per API docs
}

export interface FaceSearchResponse {
  message: string;
  record?: any; // Single record object if found
}

export const getRecordsByUser = async (userId: string): Promise<any> => {
  if (!userId) {
    return { message: "No user ID provided", records: [] };
  }
  const response = await fetch(`${API_URL}/get_records_by_user/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch records");
  }
  return response.json();
};

export const reportLostPerson = async (data: LostPersonData): Promise<LostPersonResponse> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'file') {
      formData.append('file', value);
    } else {
      formData.append(key, value.toString());
    }
  });
  const response = await fetch(`${API_URL}/upload_lost`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit lost person report");
  }
  return response.json();
};

export const reportFoundPerson = async (data: FoundPersonData): Promise<FoundPersonResponse> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'file') {
      formData.append('file', value);
    } else {
      formData.append(key, value.toString());
    }
  });
  const response = await fetch(`${API_URL}/upload_found`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit found person report");
  }
  return response.json();
};

export const submitLiveFeed = async (data: LiveFeedData): Promise<LiveFeedResponse> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'file') {
      formData.append('file', value, 'frame.jpg');
    } else {
      formData.append(key, value.toString());
    }
  });
  const response = await fetch(`${API_URL}/upload_live_feed`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit live feed frame");
  }
  return response.json();
};

export const searchFaceById = async (faceId: string): Promise<FaceSearchResponse> => {
  const response = await fetch(`${API_URL}/search_face/${faceId}`);
  if (!response.ok) {
    let errorMsg = "Failed to search for face";
    try {
      const err = await response.json();
      errorMsg = err.detail || errorMsg;
    } catch (e) {}
    throw new Error(errorMsg);
  }
  return response.json();
};
