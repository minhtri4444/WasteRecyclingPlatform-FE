import axiosInstance from "./axiosInstance";

const collectorService = {
	getAssignments: () => axiosInstance.get("/Collector/assignments"),
	getStats: () => axiosInstance.get("/Collector/stats"),
	updateAssignmentStatus: (assignmentId, data) =>
		axiosInstance.put(`/Collector/assignments/${assignmentId}`, data),
};

export default collectorService;
