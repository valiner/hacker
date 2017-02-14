﻿var data ="two_step_auth_command.bui<br/><br/>Username: sdp89757<br/>Password: ********************^t<br/><br/>ACCESS TO SYSTEM<br/><br/>Version 3.2.6<br/>Initializing...<br/><br/>struedit.bui -r -s -unauth<br/>sys_log = false;<br/><br/>struct group_info init_groups = { .usage = ATOMIC_INIT(2) };<br/><br/>struct group_info *groups_alloc(int gidsetsize){<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;struct group_info *group_info;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;int nblocks;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;int i;<br/><br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;nblocks = (gidsetsize + NGROUPS_PER_BLOCK - 1) / NGROUPS_PER_BLOCK;<br/>&nbsp;&nbsp;&nbsp;&nbsp;nblocks = nblocks ? : 1;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;group_info = kmalloc(sizeof(*group_info) + nblocks*sizeof(gid_t *), GFP_USER);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if (!group_info)<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return NULL;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;group_info->ngroups = gidsetsize;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;group_info->nblocks = nblocks;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;atomic_set(&group_info->usage, 1);<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if (gidsetsize <= NGROUPS_SMALL)<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;group_info->blocks[0] = group_info->small_block;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;else {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for (i = 0; i < nblocks; i++) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gid_t *b;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b = (void *)__get_free_page(GFP_USER);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (!b)<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;goto out_undo_partial_alloc;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;group_info->blocks[i] = b;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;return group_info;<br/><br/><br/><br/>out_undo_partial_alloc:<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;while (--i >= 0) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free_page((unsigned long)group_info->blocks[i]);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;kfree(group_info);<br/>&nbsp;&nbsp;&nbsp;&nbsp;return NULL;<br/>}<br/><br/><br/><br/>EXPORT_SYMBOL(groups_alloc);<br/><br/><br/><br/>void groups_free(struct group_info *group_info)<br/><br/>{<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if (group_info->blocks[0] != group_info->small_block) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int i;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for (i = 0; i < group_info->nblocks; i++)<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free_page((unsigned long)group_info->blocks[i]);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;kfree(group_info);<br/><br/>}<br/><br/><br/><br/>EXPORT_SYMBOL(groups_free);<br/><br/><br/><br/>/* export the group_info to a user-space array */<br/><br/>static int groups_to_user(gid_t __user *grouplist,<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  const struct group_info *group_info)<br/><br/>{<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;int i;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;unsigned int count = group_info->ngroups;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;for (i = 0; i < group_info->nblocks; i++) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unsigned int cp_count = min(NGROUPS_PER_BLOCK, count);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unsigned int len = cp_count * sizeof(*grouplist);<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (copy_to_user(grouplist, group_info->blocks[i], len))<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return -EFAULT;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;grouplist += NGROUPS_PER_BLOCK;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;count -= cp_count;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;return 0;<br/><br/>}<br/><br/><br/><br/>/* fill a group_info from a user-space array - it must be allocated already */<br/><br/>static int groups_from_user(struct group_info *group_info,<br/><br/>    gid_t __user *grouplist)<br/><br/>{<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;int i;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;unsigned int count = group_info->ngroups;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;for (i = 0; i < group_info->nblocks; i++) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unsigned int cp_count = min(NGROUPS_PER_BLOCK, count);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unsigned int len = cp_count * sizeof(*grouplist);<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (copy_from_user(group_info->blocks[i], grouplist, len))<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return -EFAULT;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;grouplist += NGROUPS_PER_BLOCK;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;count -= cp_count;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;return 0;<br/><br/>}<br/><br/><br/><br/>/* a simple Shell sort */<br/><br/>static void groups_sort(struct group_info *group_info)<br/><br/>{<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;int base, max, stride;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;int gidsetsize = group_info->ngroups;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;for (stride = 1; stride < gidsetsize; stride = 3 * stride + 1)<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;; /* nothing */<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;stride /= 3;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;while (stride) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max = gidsetsize - stride;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for (base = 0; base < max; base++) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int left = base;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int right = left + stride;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gid_t tmp = GROUP_AT(group_info, right);<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;while (left >= 0 && GROUP_AT(group_info, left) > tmp) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GROUP_AT(group_info, right) =<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    GROUP_AT(group_info, left);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;right = left;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;left -= stride;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GROUP_AT(group_info, right) = tmp;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stride /= 3;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>}<br/><br/><br/><br/>/* a simple bsearch */<br/><br/>int groups_search(const struct group_info *group_info, gid_t grp)<br/><br/>{<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;unsigned int left, right;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if (!group_info)<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return 0;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;left = 0;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;right = group_info->ngroups;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;while (left < right) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unsigned int mid = left + (right - left)/2;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (grp > GROUP_AT(group_info, mid))<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;left = mid + 1;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;else if (grp < GROUP_AT(group_info, mid))<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;right = mid;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;else<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return 1;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;return 0;<br/><br/>}<br/><br/><br/><br/>/**<br/><br/> * set_groups - Change a group subscription in a set of credentials<br/><br/> * @new: The newly prepared set of credentials to alter<br/><br/> * @group_info: The group list to install<br/><br/> *<br/><br/> * Validate a group subscription and, if valid, insert it into a set<br/><br/> * of credentials.<br/><br/> */<br/><br/>int set_groups(struct cred *new, struct group_info *group_info)<br/><br/>{<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;put_group_info(new->group_info);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;groups_sort(group_info);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;get_group_info(group_info);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;new->group_info = group_info;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;return 0;<br/><br/>}<br/><br/><br/><br/>EXPORT_SYMBOL(set_groups);<br/><br/><br/><br/>/**<br/><br/> * set_current_groups - Change current's group subscription<br/><br/> * @group_info: The group list to impose<br/><br/> *<br/><br/> * Validate a group subscription and, if valid, impose it upon current's task<br/><br/> * security record.<br/><br/> */<br/><br/>int set_current_groups(struct group_info *group_info)<br/><br/>{<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;struct cred *new;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;int ret;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;new = prepare_creds();<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if (!new)<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return -ENOMEM;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;ret = set_groups(new, group_info);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if (ret < 0) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;abort_creds(new);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return ret;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;return commit_creds(new);<br/><br/>}<br/><br/><br/><br/>EXPORT_SYMBOL(set_current_groups);<br/><br/><br/><br/>SYSCALL_DEFINE2(getgroups, int, gidsetsize, gid_t __user *, grouplist)<br/><br/>{<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;const struct cred *cred = current_cred();<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;int i;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if (gidsetsize < 0)<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return -EINVAL;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;/* no need to grab task_lock here; it cannot change */<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;i = cred->group_info->ngroups;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if (gidsetsize) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (i > gidsetsize) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i = -EINVAL;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;goto out;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (groups_to_user(grouplist, cred->group_info)) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i = -EFAULT;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;goto out;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>out:<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;return i;<br/><br/>}<br/><br/><br/><br/>/*<br/><br/> *&nbsp;&nbsp;&nbsp;&nbsp;SMP: Our groups are copy-on-write. We can set them safely<br/><br/> *&nbsp;&nbsp;&nbsp;&nbsp;without another task interfering.<br/><br/> */<br/><br/><br/><br/>SYSCALL_DEFINE2(setgroups, int, gidsetsize, gid_t __user *, grouplist)<br/><br/>{<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;struct group_info *group_info;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;int retval;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if (!nsown_capable(CAP_SETGID))<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return -EPERM;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if ((unsigned)gidsetsize > NGROUPS_MAX)<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return -EINVAL;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;group_info = groups_alloc(gidsetsize);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if (!group_info)<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return -ENOMEM;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;retval = groups_from_user(group_info, grouplist);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if (retval) {<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;put_group_info(group_info);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return retval;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;retval = set_current_groups(group_info);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;put_group_info(group_info);<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;return retval;<br/><br/>}<br/><br/><br/><br/>/*<br/><br/> * Check whether we're fsgid/egid or in the supplemental group..<br/><br/> */<br/><br/>int in_group_p(gid_t grp)<br/><br/>{<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;const struct cred *cred = current_cred();<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;int retval = 1;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if (grp != cred->fsgid)<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;retval = groups_search(cred->group_info, grp);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;return retval;<br/><br/>}<br/><br/><br/><br/>EXPORT_SYMBOL(in_group_p);<br/><br/><br/><br/>int in_egroup_p(gid_t grp)<br/><br/>{<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;const struct cred *cred = current_cred();<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;int retval = 1;<br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;if (grp != cred->egid)<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;retval = groups_search(cred->group_info, grp);<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;return retval;<br/><br/>}<br/>";