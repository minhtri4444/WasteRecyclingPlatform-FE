import { useState, useEffect, useRef } from "react";
import {
	Truck,
	CheckCircle2,
	Clock,
	MapPin,
	User,
	Calendar,
	Package,
	Camera,
	X,
	Loader2,
	AlertCircle,
	ArrowRight,
	Image as ImageIcon,
	Leaf,
} from "lucide-react";
import collectorService from "../../apis/collector";

const STATUS_CONFIG = {
	Assigned: {
		label: "Chờ thu gom",
		color: "text-amber-400",
		bg: "bg-amber-500/10",
		border: "border-amber-500/25",
		dot: "bg-amber-400",
		glow: "shadow-amber-500/20",
	},
	"On the way": {
		label: "Đang trên đường",
		color: "text-sky-400",
		bg: "bg-sky-500/10",
		border: "border-sky-500/25",
		dot: "bg-sky-400",
		glow: "shadow-sky-500/20",
	},
	Collected: {
		label: "Đã hoàn thành",
		color: "text-emerald-400",
		bg: "bg-emerald-500/10",
		border: "border-emerald-500/25",
		dot: "bg-emerald-400",
		glow: "shadow-emerald-500/20",
	},
};

const WASTE_TYPE_COLORS = {
	Organic: "text-lime-400 bg-lime-500/10 border-lime-500/20",
	Recyclable: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
	Hazardous: "text-red-400 bg-red-500/10 border-red-500/20",
	Electronic: "text-violet-400 bg-violet-500/10 border-violet-500/20",
};

const MOCK_ASSIGNMENTS = [
	{
		assignmentId: 1,
		reportId: 1,
		report: {
			reportId: 1,
			citizenName: "Minh Trí",
			wasteTypeName: "Organic",
			imageUrl: null,
			description: "Đống rác hữu cơ gần cổng trường",
			latitude: 10.762622,
			longitude: 106.660172,
			status: "Assigned",
			createdAt: "2026-03-24T08:06:22.32",
			acceptedByEnterpriseName: "Green Clean Co.",
		},
		collectorId: 9,
		collectorName: "string",
		assignedAt: "2026-03-24T08:12:04.533",
		collectedAt: null,
		status: "Assigned",
		proofImageUrl: null,
	},
	{
		assignmentId: 2,
		reportId: 2,
		report: {
			reportId: 2,
			citizenName: "Lan Phương",
			wasteTypeName: "Recyclable",
			imageUrl: null,
			description: "Thùng rác tái chế đầy ở công viên 23/9",
			latitude: 10.771593,
			longitude: 106.657281,
			status: "Assigned",
			createdAt: "2026-03-23T14:30:00",
			acceptedByEnterpriseName: "EcoViet",
		},
		collectorId: 9,
		collectorName: "string",
		assignedAt: "2026-03-23T15:00:00",
		collectedAt: null,
		status: "On the way",
		proofImageUrl: null,
	},
	{
		assignmentId: 3,
		reportId: 3,
		report: {
			reportId: 3,
			citizenName: "Hoàng Nam",
			wasteTypeName: "Electronic",
			imageUrl: null,
			description: "Máy tính cũ bỏ trước nhà",
			latitude: 10.780015,
			longitude: 106.641953,
			status: "Assigned",
			createdAt: "2026-03-22T09:00:00",
			acceptedByEnterpriseName: "TechRecycle",
		},
		collectorId: 9,
		collectorName: "string",
		assignedAt: "2026-03-22T10:00:00",
		collectedAt: "2026-03-22T11:30:00",
		status: "Collected",
		proofImageUrl: "https://placehold.co/400x300/1a2a1a/4ade80?text=Proof",
	},
];

function StatCard({ icon: Icon, label, value, color, border, bg }) {
	return (
		<div
			className={`relative overflow-hidden rounded-2xl border ${border} ${bg} p-5 flex items-center gap-4`}
		>
			<div
				className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} border ${border}`}
			>
				<Icon size={22} className={color} />
			</div>
			<div>
				<p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-0.5">
					{label}
				</p>
				<p className={`text-3xl font-black ${color} leading-none`}>{value}</p>
			</div>
			<div
				className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-10 ${bg} blur-xl`}
			/>
		</div>
	);
}

function TaskCard({ task, onAction }) {
	const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.Assigned;
	const wasteCfg =
		WASTE_TYPE_COLORS[task.report.wasteTypeName] ||
		"text-white/50 bg-white/5 border-white/10";
	const date = new Date(task.assignedAt).toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div
			className={`group relative rounded-2xl border ${cfg.border} bg-[#0d120d] hover:bg-[#111711] transition-all duration-300 overflow-hidden`}
		>
			<div className={`h-0.5 w-full ${cfg.dot} opacity-60`} />

			<div className="p-5">
				<div className="flex items-start justify-between gap-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div
							className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.color} border ${cfg.border}`}
						>
							<span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
							{cfg.label}
						</div>
						<span
							className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${wasteCfg}`}
						>
							{task.report.wasteTypeName}
						</span>
					</div>
					<span className="text-[11px] text-white/25 font-mono">
						#{task.assignmentId.toString().padStart(4, "0")}
					</span>
				</div>

				<p className="text-sm text-white/70 font-medium leading-relaxed mb-4 line-clamp-2">
					{task.report.description || "Không có mô tả"}
				</p>

				<div className="grid grid-cols-2 gap-2 mb-4">
					<div className="flex items-center gap-1.5 text-white/35">
						<User size={12} />
						<span className="text-[12px] truncate">{task.report.citizenName}</span>
					</div>
					<div className="flex items-center gap-1.5 text-white/35">
						<Calendar size={12} />
						<span className="text-[12px] truncate">{date}</span>
					</div>
					<div className="flex items-center gap-1.5 text-white/35 col-span-2">
						<MapPin size={12} className="flex-shrink-0" />
						<span className="text-[12px] truncate">
							{task.report.latitude.toFixed(4)}, {task.report.longitude.toFixed(4)}
						</span>
					</div>
					<div className="flex items-center gap-1.5 text-white/35 col-span-2">
						<Package size={12} className="flex-shrink-0" />
						<span className="text-[12px] truncate">
							{task.report.acceptedByEnterpriseName}
						</span>
					</div>
				</div>

				{task.status === "Collected" && task.proofImageUrl && (
					<div className="mb-4 rounded-xl overflow-hidden border border-emerald-500/20">
						<img
							src={task.proofImageUrl}
							alt="Bằng chứng"
							className="w-full h-28 object-cover opacity-80"
						/>
						<div className="px-3 py-1.5 bg-emerald-500/10 flex items-center gap-1.5">
							<CheckCircle2 size={12} className="text-emerald-400" />
							<span className="text-[11px] text-emerald-400 font-semibold">
								Đã nộp bằng chứng
							</span>
						</div>
					</div>
				)}

				{task.status !== "Collected" && (
					<button
						onClick={() => onAction(task)}
						className={`w-full py-2.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all duration-200
							${
								task.status === "Assigned"
									? "bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 hover:border-sky-500/50"
									: "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50"
							}`}
					>
						{task.status === "Assigned" ? (
							<>
								<Truck size={15} /> Bắt đầu thu gom
								<ArrowRight size={13} />
							</>
						) : (
							<>
								<Camera size={15} /> Hoàn thành & Nộp ảnh
								<ArrowRight size={13} />
							</>
						)}
					</button>
				)}

				{task.status === "Collected" && (
					<div className="w-full py-2.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 bg-emerald-500/8 text-emerald-500/50 border border-emerald-500/15">
						<CheckCircle2 size={15} /> Nhiệm vụ hoàn thành
					</div>
				)}
			</div>
		</div>
	);
}

function ProofModal({ task, onClose, onSubmit, loading }) {
	const [proofImage, setProofImage] = useState(null);
	const [preview, setPreview] = useState(null);
	const fileRef = useRef();

	const handleFile = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setProofImage(file);
		setPreview(URL.createObjectURL(file));
	};

	const handleSubmit = () => {
		onSubmit(task.assignmentId, proofImage);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/80 backdrop-blur-md"
				onClick={onClose}
			/>
			<div className="relative z-10 w-full max-w-md bg-[#0d120d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
				<div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
					<div>
						<h3 className="text-white font-black text-lg">Nộp bằng chứng</h3>
						<p className="text-white/35 text-xs mt-0.5">
							Chụp ảnh rác đã thu gom để xác nhận
						</p>
					</div>
					<button
						onClick={onClose}
						className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all"
					>
						<X size={16} />
					</button>
				</div>

				<div className="p-6 space-y-4">
					<div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex gap-3 items-start">
						<div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
							<Package size={15} className="text-emerald-400" />
						</div>
						<div className="min-w-0">
							<p className="text-white/80 text-sm font-semibold line-clamp-1">
								{task.report.description || "Nhiệm vụ #" + task.assignmentId}
							</p>
							<p className="text-white/30 text-xs mt-0.5">{task.report.citizenName}</p>
						</div>
					</div>

					<div
						onClick={() => fileRef.current?.click()}
						className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
							${preview ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"}`}
					>
						<input
							ref={fileRef}
							type="file"
							accept="image/*"
							capture="environment"
							className="hidden"
							onChange={handleFile}
						/>
						{preview ? (
							<div className="relative">
								<img
									src={preview}
									alt="Preview"
									className="w-full h-52 object-cover rounded-2xl"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl flex items-end p-3">
									<span className="text-xs text-white/70 font-medium flex items-center gap-1">
										<ImageIcon size={12} /> Nhấn để đổi ảnh
									</span>
								</div>
							</div>
						) : (
							<div className="py-10 flex flex-col items-center gap-3">
								<div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
									<Camera size={24} className="text-white/25" />
								</div>
								<div className="text-center">
									<p className="text-white/50 text-sm font-semibold">
										Chụp hoặc chọn ảnh bằng chứng
									</p>
									<p className="text-white/20 text-xs mt-1">JPG, PNG tối đa 10MB</p>
								</div>
							</div>
						)}
					</div>

					<div className="flex gap-2.5 pt-1">
						<button
							onClick={onClose}
							className="flex-1 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/[0.04] text-sm font-bold transition-all"
						>
							Huỷ
						</button>
						<button
							onClick={handleSubmit}
							disabled={!proofImage || loading}
							className={`flex-1 py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all
								${
									proofImage && !loading
										? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/25"
										: "bg-white/5 text-white/20 cursor-not-allowed"
								}`}
						>
							{loading ? (
								<>
									<Loader2 size={15} className="animate-spin" /> Đang xử lý...
								</>
							) : (
								<>
									<CheckCircle2 size={15} /> Xác nhận hoàn thành
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function CollectionTasks() {
	const [assignments, setAssignments] = useState([]);
	const [stats, setStats] = useState({ totalAssigned: 0, totalCollected: 0, totalOnTheWay: 0 });
	const [loading, setLoading] = useState(true);
	const [activeModal, setActiveModal] = useState(null);
	const [actionLoading, setActionLoading] = useState(false);
	const [filterStatus, setFilterStatus] = useState("all");
	const [useMock, setUseMock] = useState(false);

	const fetchData = async () => {
		setLoading(true);

		try {
			const [assignData, statsData] = await Promise.all([
				collectorService.getAssignments(),
				collectorService.getStats(),
			]);

			setAssignments(assignData);
			setStats(statsData);
			setUseMock(false);
		} catch {
			setAssignments(MOCK_ASSIGNMENTS);
			setStats({
				totalAssigned: 1,
				totalOnTheWay: 1,
				totalCollected: 1,
			});
			setUseMock(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleAction = (task) => {
		if (task.status === "Assigned") {
			updateStatus(task.assignmentId, "On the way", null);
		} else if (task.status === "On the way") {
			setActiveModal(task);
		}
	};

	const updateStatus = async (assignmentId, status, proofImageUrl) => {
		setActionLoading(true);

		try {
			await collectorService.updateAssignmentStatus(assignmentId, {
				status,
				proofImageUrl: proofImageUrl || "",
			});

			setAssignments((prev) =>
				prev.map((a) =>
					a.assignmentId === assignmentId
						? { ...a, status, proofImageUrl: proofImageUrl || a.proofImageUrl }
						: a,
				),
			);

			setStats((prev) => {
				const next = { ...prev };
				if (status === "On the way") {
					next.totalAssigned = Math.max(0, next.totalAssigned - 1);
					next.totalOnTheWay = (next.totalOnTheWay || 0) + 1;
				} else if (status === "Collected") {
					next.totalOnTheWay = Math.max(0, (next.totalOnTheWay || 0) - 1);
					next.totalCollected = (next.totalCollected || 0) + 1;
				}
				return next;
			});
		} catch {
			setAssignments((prev) =>
				prev.map((a) => (a.assignmentId === assignmentId ? { ...a, status } : a)),
			);
		} finally {
			setActionLoading(false);
			setActiveModal(null);
		}
	};

	const handleProofSubmit = (assignmentId, imageFile) => {
		const mockUrl = imageFile ? URL.createObjectURL(imageFile) : null;
		updateStatus(assignmentId, "Collected", mockUrl);
	};

	const filtered =
		filterStatus === "all"
			? assignments
			: assignments.filter((a) => a.status === filterStatus);

	const FILTERS = [
		{ key: "all", label: "Tất cả" },
		{ key: "Assigned", label: "Chờ thu gom" },
		{ key: "On the way", label: "Đang đi" },
		{ key: "Collected", label: "Hoàn thành" },
	];

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1
						className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight"
						style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
					>
						Nhiệm vụ thu gom
					</h1>
					<p className="text-white/35 text-sm mt-1">
						Quản lý và cập nhật trạng thái các nhiệm vụ được giao
					</p>
				</div>
				{useMock && (
					<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold flex-shrink-0">
						<AlertCircle size={12} />
						Demo
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				<StatCard
					icon={Clock}
					label="Chờ thu gom"
					value={loading ? "—" : stats.totalAssigned ?? 0}
					color="text-amber-400"
					bg="bg-amber-500/8"
					border="border-amber-500/20"
				/>
				<StatCard
					icon={Truck}
					label="Đang trên đường"
					value={loading ? "—" : stats.totalOnTheWay ?? 0}
					color="text-sky-400"
					bg="bg-sky-500/8"
					border="border-sky-500/20"
				/>
				<StatCard
					icon={CheckCircle2}
					label="Đã hoàn thành"
					value={loading ? "—" : stats.totalCollected ?? 0}
					color="text-emerald-400"
					bg="bg-emerald-500/8"
					border="border-emerald-500/20"
				/>
			</div>

			<div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1.5 w-fit">
				{FILTERS.map((f) => (
					<button
						key={f.key}
						onClick={() => setFilterStatus(f.key)}
						className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
							filterStatus === f.key
								? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
								: "text-white/30 hover:text-white/60"
						}`}
					>
						{f.label}
						{f.key !== "all" && (
							<span className="ml-1.5 opacity-60">
								{
									assignments.filter((a) =>
										f.key === "all" ? true : a.status === f.key,
									).length
								}
							</span>
						)}
					</button>
				))}
			</div>

			{loading ? (
				<div className="flex items-center justify-center py-20">
					<div className="flex flex-col items-center gap-3">
						<div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
							<Loader2 size={20} className="text-emerald-400 animate-spin" />
						</div>
						<p className="text-white/30 text-sm">Đang tải nhiệm vụ...</p>
					</div>
				</div>
			) : filtered.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 gap-4">
					<div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
						<Leaf size={28} className="text-white/15" />
					</div>
					<div className="text-center">
						<p className="text-white/40 font-semibold">Không có nhiệm vụ nào</p>
						<p className="text-white/20 text-sm mt-1">
							{filterStatus === "all"
								? "Bạn chưa được giao nhiệm vụ nào"
								: `Không có nhiệm vụ "${STATUS_CONFIG[filterStatus]?.label}"`}
						</p>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{filtered.map((task) => (
						<TaskCard key={task.assignmentId} task={task} onAction={handleAction} />
					))}
				</div>
			)}

			{activeModal && (
				<ProofModal
					task={activeModal}
					onClose={() => setActiveModal(null)}
					onSubmit={handleProofSubmit}
					loading={actionLoading}
				/>
			)}
		</div>
	);
}
