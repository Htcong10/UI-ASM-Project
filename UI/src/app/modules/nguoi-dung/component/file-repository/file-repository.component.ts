import {Component, OnInit} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {HighlightAutoResult} from 'ngx-highlightjs';

@Component({
    selector: 'app-file-repository',
    templateUrl: './file-repository.component.html',
    styleUrls: ['./file-repository.component.scss']
})
export class FileRepositoryComponent implements OnInit {
    folderIcon = 'pi pi-folder';
    fileIcon = 'pi pi-file';
    files1: TreeNode[] = [];
    fileContent = `package cfm.ServiceQTHT.controllers;\n\nimport cfm.ServiceQTHT.dto.*;\nimport cfm.ServiceQTHT.services.DefectService;\nimport cfm.ServiceQTHT.services.GitManagerService;\nimport org.eclipse.jgit.api.errors.GitAPIException;\nimport org.eclipse.jgit.diff.DiffEntry;\nimport org.eclipse.jgit.lib.Ref;\nimport org.eclipse.jgit.revwalk.RevCommit;\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.web.bind.annotation.*;\n\nimport java.io.IOException;\nimport java.util.List;\n\n@RestController\n@RequestMapping(\"/git\")\npublic class GitController {\n\n    @Autowired\n    private final GitManagerService gitManagerService;\n    @Autowired\n    private final DefectService defectService;\n\n    public GitController(GitManagerService gitManagerService, DefectService defectService) {\n        this.gitManagerService = gitManagerService;\n        this.defectService = defectService;\n    }\n\n    @PostMapping(\"/clone\")\n    public String cloneRepository(@RequestBody GitRequestDTO requestDTO) {\n        try {\n            gitManagerService.cloneRepository(requestDTO);\n            return \"Repository cloned successfully.\";\n        } catch (GitAPIException e) {\n            e.printStackTrace();\n            return \"Error cloning repository.\";\n        }\n    }\n\n    @PostMapping(\"/addRepository\")\n    public ResponseObjectDTO addRepository(@RequestBody GitRequestDTO requestDTO) throws GitAPIException {\n        return defectService.addRepository(requestDTO);\n    }\n\n    @GetMapping(\"/branches\")\n    public List<String> getAllBranches(@RequestBody GitRequestDTO requestDTO) {\n        return gitManagerService.getAllBranches(requestDTO.localPath);\n    }\n\n    @GetMapping(\"/commits\")\n    public List<RevCommitDTO> getCommits(@RequestBody GitRequestDTO requestDTO) {\n        return gitManagerService.getCommits(requestDTO.localPath, requestDTO.branch);\n    }\n\n    @GetMapping(\"/diff\")\n    public List<DiffEntryDTO> compareWithCommit(@RequestBody GitRequestDTO requestDTO) {\n        return gitManagerService.getChangesWithContentFromCommit(requestDTO);\n    }\n\n    @GetMapping(\"/getChangedFiles\")\n    public FileContentDTO getChangedFiles(@RequestBody GitRequestDTO requestDTO) throws GitAPIException, IOException {\n        return gitManagerService.getOldAndNewFileContent(requestDTO);\n    }\n\n    @GetMapping(\"/pull\")\n    public String pullLatest(@RequestBody GitRequestDTO requestDTO) throws GitAPIException, IOException {\n        return gitManagerService.pullLatest(requestDTO.getLocalPath(), requestDTO.getBranch());\n    }\n\n    @GetMapping(\"/fetch\")\n    public String fetchLatest(@RequestBody GitRequestDTO requestDTO) throws GitAPIException, IOException {\n        return gitManagerService.fetchLatest(requestDTO);\n    }\n}\n\n`;
    response!: HighlightAutoResult;

    constructor() {
    }

    ngOnInit(): void {
        const folderStructure: string[] = [
            '.gitignore',
            '.mvn/wrapper/maven-wrapper.jar',
            '.mvn/wrapper/maven-wrapper.properties',
            'README.md',
            'mvnw',
            'mvnw.cmd',
            'pom.xml',
            'src/main/java/cfm/ServiceQTHT/ServiceQTHTApplication.java',
            'src/main/java/cfm/ServiceQTHT/components/TransformXSLTAndXML.java',
            'src/main/java/cfm/ServiceQTHT/configuration/ModelMapperConfig.java',
            'src/main/java/cfm/ServiceQTHT/configuration/SwaggerConfig.java',
            'src/main/java/cfm/ServiceQTHT/controllers/GitController.java',
            'src/main/java/cfm/ServiceQTHT/controllers/QuanTriHeThongController.java',
            'src/main/java/cfm/ServiceQTHT/controllers/SourceCodeController.java',
            'src/main/java/cfm/ServiceQTHT/controllers/UserController.java',
            // Add other files and folders here
        ];
        this.files1 = this.generateTreeNodeData(folderStructure);
    }

    generateTreeNodeData(structure: string[]): TreeNode[] {
        const treeData: TreeNode[] = [];

        // Sort structure array by placing directories first
        const sortedStructure = structure.sort((a, b) => {
            const isDirectoryA = a.includes('/');
            const isDirectoryB = b.includes('/');
            if (isDirectoryA && !isDirectoryB) {
                return -1;
            } else if (!isDirectoryA && isDirectoryB) {
                return 1;
            }
            return 0;
        });

        sortedStructure.forEach(path => {
            const pathParts = path.split('/');
            let currentLevel = treeData;
            let currentPath = '';

            pathParts.forEach((part, index) => {
                currentPath = currentPath ? `${currentPath}/${part}` : part; // Xây dựng đường dẫn
                const existingPath = currentLevel.find(item => item.label === part && item.icon === this.folderIcon) as TreeNode | undefined;
                if (existingPath) {
                    currentLevel = existingPath.children || [];
                } else {
                    const newNode: TreeNode = {
                        label: part,
                        icon: index === pathParts.length - 1 ? this.fileIcon : this.folderIcon,
                        data: {path: currentPath} // Gắn đường dẫn vào nút
                    };
                    currentLevel.push(newNode);
                    if (index !== pathParts.length - 1) {
                        newNode.children = [];
                        currentLevel = newNode.children;
                    }
                }
            });
        });

        return treeData;
    }

    onHighlight(e: HighlightAutoResult) {
        this.response = {
            language: e.language,
            relevance: e.relevance,
            secondBest: '{...}',
            value: '{...}',
        };
    }

    handleClick(event: any) {
        console.log(event);
    }

    renderCommitGraph() {
        const data = [
            {
                id: '51149621e70bf62c4c0f07d0ca87f38e605085c4',
                authorName: 'LeHa2505',
                authorEmail: 'leha25052001@gmail.com',
                committerName: 'LeHa2505',
                committerEmail: 'leha25052001@gmail.com',
                fullMessage: 'https://devops.evn.com.vn/KDDVKH/CMIS4/_backlogs/backlog/CMIS4%20Team/Features/?workitem=109\n',
                shortMessage: 'https://devops.evn.com.vn/KDDVKH/CMIS4/_backlogs/backlog/CMIS4%20Team/Features/?workitem=109',
                committedAt: '2024-01-30T09:38:17.000+00:00'
            },
            {
                id: 'bec7b0fe8dcdff48e3d71e60f342284ded1618ca',
                authorName: 'dungnv1',
                authorEmail: 'dungnv1.evnit@evn.com.vn',
                committerName: 'dungnv1',
                committerEmail: 'dungnv1.evnit@evn.com.vn',
                fullMessage: 'cap nhat cau hinh Quan ly tiep nhan luoi dien\n',
                shortMessage: 'cap nhat cau hinh Quan ly tiep nhan luoi dien',
                committedAt: '2024-01-25T07:16:45.000+00:00'
            }
        ];
    }
}
